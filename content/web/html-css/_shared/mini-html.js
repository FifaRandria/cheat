// Mini-analyseur HTML pour les tests des niveaux HTML/CSS.
// Il construit un arbre simple ({ tag, attrs, children, parent } ou { text }) : assez pour
// vérifier la structure d'une page, sans navigateur. Copié dans tests/ de chaque niveau.

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

const TOKEN =
  /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/\s*([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/gi;
const ATTR = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

function parseAttrs(src) {
  const attrs = {};
  for (const m of src.matchAll(ATTR)) attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? "");
  return attrs;
}

/** Analyse un document HTML et renvoie la racine de l'arbre. */
export function parseHTML(html) {
  const root = { tag: "#document", attrs: {}, children: [], parent: null };
  let cur = root;
  let last = 0;
  for (const m of html.matchAll(TOKEN)) {
    if (m.index > last) cur.children.push({ text: decode(html.slice(last, m.index)), parent: cur });
    last = m.index + m[0].length;
    if (m[1]) {
      // Balise fermante : on remonte jusqu'à l'élément ouvert du même nom, s'il existe.
      const name = m[1].toLowerCase();
      let n = cur;
      while (n && n.tag !== name) n = n.parent;
      if (n && n.parent) cur = n.parent;
    } else if (m[2]) {
      const el = { tag: m[2].toLowerCase(), attrs: parseAttrs(m[3] ?? ""), children: [], parent: cur };
      cur.children.push(el);
      if (!VOID.has(el.tag) && !m[4]) cur = el;
    }
  }
  if (last < html.length) cur.children.push({ text: decode(html.slice(last)), parent: cur });
  return root;
}

/** Tous les éléments sous `node` (dans l'ordre du document) qui vérifient `pred`. */
export function findAll(node, pred = () => true) {
  const out = [];
  const walk = (n) => {
    for (const c of n.children ?? []) {
      if (c.tag) {
        if (pred(c)) out.push(c);
        walk(c);
      }
    }
  };
  walk(node);
  return out;
}

/** Les éléments d'un ou plusieurs types : byTag(doc, "h1", "h2"). */
export const byTag = (node, ...tags) => findAll(node, (el) => tags.includes(el.tag));

/** Le texte visible d'un élément, espaces normalisés. */
export function text(node) {
  if (node.text !== undefined) return node.text.replace(/\s+/g, " ");
  return (node.children ?? []).map(text).join("").replace(/\s+/g, " ").trim();
}

/** L'ancêtre le plus proche avec ce nom de balise, ou null. */
export function closest(el, tag) {
  for (let n = el.parent; n; n = n.parent) if (n.tag === tag) return n;
  return null;
}

/** Les enfants directs qui sont des éléments. */
export const elementChildren = (el) => el.children.filter((c) => c.tag);

/** Décrit un élément pour les messages d'échec : <input name="email">. */
export function describe(el) {
  const keys = ["id", "name", "type", "class", "src", "href"].filter((k) => k in el.attrs);
  return `<${el.tag}${keys.map((k) => ` ${k}="${el.attrs[k]}"`).join("")}>`;
}
