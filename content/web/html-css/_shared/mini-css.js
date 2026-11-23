// Mini-moteur de cascade CSS pour les tests des niveaux HTML/CSS.
// Il applique les vraies règles du navigateur (!important, spécificité, ordre d'apparition)
// sur des sélecteurs simples : balise, .classe, #id, *, sélecteurs composés (button.primaire),
// descendant (nav a) et enfant (ul > li). Copié dans tests/ de chaque niveau.

const COMPOUND = /^(\*|[a-zA-Z][\w-]*)?((?:[.#][\w-]+)*)$/;

function parseCompound(src) {
  const m = COMPOUND.exec(src);
  if (!m) throw new Error(`sélecteur non pris en charge par le moteur de test : « ${src} »`);
  const tag = m[1] && m[1] !== "*" ? m[1].toLowerCase() : null;
  const ids = [...m[2].matchAll(/#([\w-]+)/g)].map((x) => x[1]);
  const classes = [...m[2].matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
  return { tag, ids, classes };
}

/** Découpe « nav > ul a » en [{compound, combinator}] de gauche à droite. */
function parseSelector(src) {
  const tokens = src.trim().replace(/\s*>\s*/g, " > ").split(/\s+/);
  const parts = [];
  let combinator = " ";
  for (const t of tokens) {
    if (t === ">") {
      combinator = ">";
      continue;
    }
    parts.push({ ...parseCompound(t), combinator });
    combinator = " ";
  }
  return parts;
}

/** Spécificité [ids, classes, balises]. */
export function specificity(selector) {
  const parts = typeof selector === "string" ? parseSelector(selector) : selector;
  return parts.reduce(
    (s, p) => [s[0] + p.ids.length, s[1] + p.classes.length, s[2] + (p.tag ? 1 : 0)],
    [0, 0, 0],
  );
}

const classList = (el) => (el.attrs?.class ?? "").split(/\s+/).filter(Boolean);

function matchesCompound(el, c) {
  if (!el || !el.tag || el.tag === "#document") return false;
  if (c.tag && el.tag !== c.tag) return false;
  if (c.ids.some((id) => el.attrs.id !== id)) return false;
  const cls = classList(el);
  return c.classes.every((k) => cls.includes(k));
}

function matchesFrom(el, parts, i) {
  if (!matchesCompound(el, parts[i])) return false;
  if (i === 0) return true;
  if (parts[i].combinator === ">") return matchesFrom(el.parent, parts, i - 1);
  for (let a = el.parent; a; a = a.parent) if (matchesFrom(a, parts, i - 1)) return true;
  return false;
}

/** Le sélecteur s'applique-t-il à cet élément ? */
export function matches(el, selector) {
  const parts = typeof selector === "string" ? parseSelector(selector) : selector;
  return matchesFrom(el, parts, parts.length - 1);
}

/** Analyse une feuille de style (sans @media) en règles ordonnées. */
export function parseCSS(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  if (/@media|@supports|@layer/.test(clean)) {
    throw new Error("les blocs @media, @supports et @layer ne sont pas pris en charge par le moteur de test");
  }
  const rules = [];
  let order = 0;
  for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = [];
    for (const d of m[2].split(";")) {
      const i = d.indexOf(":");
      if (i < 0) continue;
      const prop = d.slice(0, i).trim().toLowerCase();
      let value = d.slice(i + 1).trim();
      const important = /!\s*important$/i.test(value);
      value = value.replace(/!\s*important$/i, "").trim();
      if (prop) declarations.push({ prop, value, important });
    }
    for (const sel of m[1].split(",")) {
      const parts = parseSelector(sel);
      rules.push({ selector: sel.trim(), parts, specificity: specificity(parts), declarations, order: order++ });
    }
  }
  return rules;
}

const compare = (a, b) => {
  if (a.important !== b.important) return a.important ? 1 : -1;
  for (let k = 0; k < 3; k++) if (a.specificity[k] !== b.specificity[k]) return a.specificity[k] - b.specificity[k];
  return a.order - b.order;
};

/**
 * La valeur finale d'une propriété pour un élément, comme dans le navigateur
 * (sans héritage) : { value, selector } ou null si aucune règle ne la définit.
 */
export function computed(el, prop, rules) {
  const candidates = [];
  for (const r of rules) {
    if (!matches(el, r.parts)) continue;
    for (const d of r.declarations) {
      if (d.prop === prop) candidates.push({ ...d, specificity: r.specificity, order: r.order, selector: r.selector });
    }
  }
  if (candidates.length === 0) return null;
  const win = candidates.sort(compare).at(-1);
  return { value: win.value, selector: win.selector };
}
