// Mini-DOM pour les tests : une page HTML qu'on peut lire, modifier, cliquer et remplir,
// sans navigateur. Il reproduit le comportement du vrai DOM sur ce qui sert dans les niveaux :
// sélecteurs simples, textContent / innerHTML, classList, événements qui remontent (bubbling),
// formulaires qui rechargent la page si on ne l'empêche pas. Copié dans tests/ de chaque niveau.
import { matches } from "./mini-css.js";
import { parseHTML } from "./mini-html.js";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const echapper = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export class Evenement {
  constructor(type, init = {}) {
    this.type = type;
    this.bubbles = init.bubbles ?? true;
    this.defaultPrevented = false;
    this.target = null;
    this.currentTarget = null;
    this.arrete = false;
    Object.assign(this, init.detail ? { detail: init.detail } : {});
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.arrete = true;
  }
}

class Texte {
  constructor(texte) {
    this.text = texte;
    this.parent = null;
  }
  get textContent() {
    return this.text;
  }
  get outerHTML() {
    return echapper(this.text).replaceAll("&quot;", '"');
  }
}

class Element {
  constructor(doc, tag, attrs = {}) {
    this.ownerDocument = doc;
    this.tag = tag.toLowerCase();
    this.attrs = { ...attrs };
    this.childNodes = [];
    this.parent = null;
    this.ecouteurs = {};
    this._value = attrs.value ?? "";
  }

  get tagName() {
    return this.tag.toUpperCase();
  }
  get parentElement() {
    return this.parent && this.parent.tag !== "#document" ? this.parent : null;
  }
  get children() {
    return this.childNodes.filter((c) => c instanceof Element);
  }
  get id() {
    return this.attrs.id ?? "";
  }
  set id(v) {
    this.attrs.id = String(v);
  }
  get className() {
    return this.attrs.class ?? "";
  }
  set className(v) {
    this.attrs.class = String(v);
  }
  get classList() {
    const liste = () => this.className.split(/\s+/).filter(Boolean);
    const ecrire = (l) => (this.className = l.join(" "));
    return {
      add: (...c) => ecrire([...new Set([...liste(), ...c])]),
      remove: (...c) => ecrire(liste().filter((x) => !c.includes(x))),
      contains: (c) => liste().includes(c),
      toggle: (c, force) => {
        const veut = force ?? !liste().includes(c);
        ecrire(veut ? [...new Set([...liste(), c])] : liste().filter((x) => x !== c));
        return veut;
      },
    };
  }
  get dataset() {
    const el = this;
    const nom = (cle) => "data-" + cle.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    return new Proxy(
      {},
      {
        get: (_, cle) => el.attrs[nom(String(cle))],
        set: (_, cle, v) => ((el.attrs[nom(String(cle))] = String(v)), true),
      },
    );
  }
  getAttribute(n) {
    return n in this.attrs ? this.attrs[n] : null;
  }
  setAttribute(n, v) {
    this.attrs[n.toLowerCase()] = String(v);
  }
  removeAttribute(n) {
    delete this.attrs[n.toLowerCase()];
  }
  hasAttribute(n) {
    return n.toLowerCase() in this.attrs;
  }
  get type() {
    return this.attrs.type ?? (this.tag === "button" ? "submit" : this.tag === "input" ? "text" : "");
  }
  set type(v) {
    this.attrs.type = String(v);
  }
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = String(v);
  }
  get disabled() {
    return "disabled" in this.attrs;
  }
  set disabled(v) {
    if (v) this.attrs.disabled = "";
    else delete this.attrs.disabled;
  }
  get hidden() {
    return "hidden" in this.attrs;
  }
  set hidden(v) {
    if (v) this.attrs.hidden = "";
    else delete this.attrs.hidden;
  }

  get textContent() {
    return this.childNodes.map((c) => c.textContent).join("");
  }
  set textContent(v) {
    this.childNodes = [];
    const t = String(v ?? "");
    if (t) this.appendChild(new Texte(t));
  }
  get innerHTML() {
    return this.childNodes.map((c) => c.outerHTML).join("");
  }
  set innerHTML(html) {
    this.childNodes = [];
    for (const n of parseHTML(String(html)).children) this.appendChild(this.ownerDocument._construire(n));
  }
  get outerHTML() {
    const attrs = Object.entries(this.attrs)
      .map(([k, v]) => (v === "" ? ` ${k}` : ` ${k}="${echapper(v)}"`))
      .join("");
    if (VOID.has(this.tag)) return `<${this.tag}${attrs}>`;
    return `<${this.tag}${attrs}>${this.innerHTML}</${this.tag}>`;
  }

  appendChild(enfant) {
    if (typeof enfant === "string") enfant = new Texte(enfant);
    if (enfant.parent) enfant.parent.childNodes = enfant.parent.childNodes.filter((c) => c !== enfant);
    enfant.parent = this;
    this.childNodes.push(enfant);
    return enfant;
  }
  append(...noeuds) {
    for (const n of noeuds) this.appendChild(n);
  }
  replaceChildren(...noeuds) {
    this.childNodes = [];
    this.append(...noeuds);
  }
  remove() {
    if (!this.parent) return;
    this.parent.childNodes = this.parent.childNodes.filter((c) => c !== this);
    this.parent = null;
  }

  querySelectorAll(selecteur) {
    const sels = selecteur.split(",").map((s) => s.trim());
    const out = [];
    const parcourir = (el) => {
      for (const c of el.children) {
        if (sels.some((s) => matches(c, s))) out.push(c);
        parcourir(c);
      }
    };
    parcourir(this);
    return out;
  }
  querySelector(selecteur) {
    return this.querySelectorAll(selecteur)[0] ?? null;
  }
  closest(selecteur) {
    for (let n = this; n && n.tag !== "#document"; n = n.parent) if (matches(n, selecteur)) return n;
    return null;
  }

  addEventListener(type, fn) {
    // Comme le vrai navigateur : un écouteur qui n'est pas une fonction est ignoré sans erreur.
    if (typeof fn !== "function") return;
    (this.ecouteurs[type] ??= []).push(fn);
  }
  removeEventListener(type, fn) {
    this.ecouteurs[type] = (this.ecouteurs[type] ?? []).filter((f) => f !== fn);
  }
  dispatchEvent(ev) {
    ev.target ??= this;
    for (let n = this; n; n = n.parent) {
      ev.currentTarget = n;
      for (const fn of [...(n.ecouteurs?.[ev.type] ?? [])]) fn.call(n, ev);
      if (ev.arrete || !ev.bubbles) break;
    }
    return !ev.defaultPrevented;
  }

  /** Un clic, comme dans le navigateur : un bouton d'envoi soumet son formulaire. */
  click() {
    if (this.disabled) return;
    const ev = new Evenement("click");
    this.dispatchEvent(ev);
    const envoi = this.tag === "button" && (this.attrs.type ?? "submit") === "submit";
    if (!ev.defaultPrevented && envoi) this.closest("form")?.requestSubmit();
  }
  /** Soumet un formulaire : sans preventDefault(), le navigateur recharge la page. */
  requestSubmit() {
    const ev = new Evenement("submit");
    this.dispatchEvent(ev);
    if (!ev.defaultPrevented) this.ownerDocument.rechargements.push(this.attrs.action ?? "(même page)");
  }
}

class Document extends Element {
  constructor() {
    super(null, "#document");
    this.ownerDocument = this;
    /** Chaque rechargement de page provoqué par un formulaire non intercepté. */
    this.rechargements = [];
  }
  get body() {
    return this.querySelector("body");
  }
  get documentElement() {
    return this.querySelector("html");
  }
  getElementById(id) {
    const trouver = (el) => {
      for (const c of el.children) {
        if (c.attrs.id === id) return c;
        const r = trouver(c);
        if (r) return r;
      }
      return null;
    };
    return trouver(this);
  }
  createElement(tag) {
    return new Element(this, tag);
  }
  createTextNode(t) {
    return new Texte(String(t));
  }
  _construire(n) {
    if (n.text !== undefined) return new Texte(n.text);
    const el = new Element(this, n.tag, n.attrs);
    if (el.tag === "textarea") el._value = n.children.map((c) => c.text ?? "").join("");
    for (const c of n.children) el.appendChild(this._construire(c));
    return el;
  }
}

/** Construit une page à partir de son HTML. */
export function creerDocument(html) {
  const doc = new Document();
  for (const n of parseHTML(html).children) doc.appendChild(doc._construire(n));
  return doc;
}

/** Simule la saisie d'un texte dans un champ : la valeur change, puis l'événement input part. */
export function saisir(champ, texte) {
  champ.value = texte;
  champ.dispatchEvent(new Evenement("input"));
}

/** Laisse les promesses en attente se résoudre (après un fetch, par exemple). */
export const attendre = () => new Promise((r) => setTimeout(r, 0));
