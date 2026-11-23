// Faux fetch pour les tests : il imite fetch() et ses réponses (ok, status, json()).
// Copié dans tests/ des niveaux qui appellent une API.

function reponse(status, corps) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => {
      if (typeof corps === "string") throw new SyntaxError(`Unexpected token '<', "${corps.slice(0, 20)}" is not valid JSON`);
      return structuredClone(corps);
    },
    text: async () => (typeof corps === "string" ? corps : JSON.stringify(corps)),
  };
}

/**
 * Un fetch qui répond selon une table : { "GET /api/outils": { status: 200, corps: [...] } }.
 * fetch.appels garde chaque appel reçu : { methode, url, headers, corps }.
 */
export function fetchFixe(routes, { delai = 0 } = {}) {
  const fetch = async (url, options = {}) => {
    const methode = (options.method ?? "GET").toUpperCase();
    const appel = { methode, url: String(url), headers: options.headers ?? {}, corps: options.body };
    fetch.appels.push(appel);
    if (delai) await new Promise((r) => setTimeout(r, delai));
    const route = routes[`${methode} ${String(url).split("?")[0]}`];
    if (!route) return reponse(404, { erreur: "introuvable" });
    if (route.reseau) throw new TypeError("Failed to fetch");
    return reponse(route.status ?? 200, typeof route.corps === "function" ? route.corps(appel) : route.corps);
  };
  fetch.appels = [];
  return fetch;
}

/** Un fetch branché sur une application mini-express : le vrai backend répond. */
export function fetchDepuisApp(app, { prefixe = "/api" } = {}) {
  const fetch = async (url, options = {}) => {
    const u = new URL(String(url), "http://localhost");
    const headers = Object.fromEntries(Object.entries(options.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
    fetch.appels.push({ methode: (options.method ?? "GET").toUpperCase(), url: String(url), headers, corps: options.body });
    const r = await app.handle({
      method: (options.method ?? "GET").toUpperCase(),
      path: u.pathname.startsWith(prefixe) ? u.pathname.slice(prefixe.length) || "/" : u.pathname,
      headers,
      query: Object.fromEntries(u.searchParams),
      body: typeof options.body === "string" ? JSON.parse(options.body) : options.body,
    });
    return reponse(r.status, r.body);
  };
  fetch.appels = [];
  return fetch;
}
