// mini-express : une version miniature d'Express, fidèle à son fonctionnement.
// Ce fichier n'est pas en cause dans les incidents : il simule le framework.
//
//   const app = createApp();
//   app.use(middleware)                 middleware(req, res, next)
//   app.get("/produits/:id", handler)   aussi post, put, delete
//   app.use((err, req, res, next) => …) gestionnaire d'erreurs : exactement 4 paramètres
//   await app.handle({ method, path, headers, body, query })  → { status, body, headers }

export function createApp() {
  const stack = [];

  const add = (method, path, handlers) => {
    for (const fn of handlers) stack.push({ method, path, fn });
  };

  const app = {
    use: (...args) => add(null, typeof args[0] === "string" ? args.shift() : null, args),
    get: (path, ...h) => add("GET", path, h),
    post: (path, ...h) => add("POST", path, h),
    put: (path, ...h) => add("PUT", path, h),
    delete: (path, ...h) => add("DELETE", path, h),

    handle(request) {
      const req = { headers: {}, query: {}, body: undefined, params: {}, ...request };
      return new Promise((resolve) => {
        const res = {
          statusCode: 200,
          headers: {},
          sent: false,
          status(code) {
            res.statusCode = code;
            return res;
          },
          set(name, value) {
            res.headers[name.toLowerCase()] = value;
            return res;
          },
          json(body) {
            return res.send(body);
          },
          send(body) {
            if (res.sent) throw new Error("Réponse déjà envoyée");
            res.sent = true;
            resolve({ status: res.statusCode, body, headers: res.headers });
            return res;
          },
        };

        let i = 0;
        const next = (err) => {
          while (i < stack.length) {
            const layer = stack[i++];
            const isErrorHandler = layer.fn.length === 4;
            if (layer.method && layer.method !== req.method) continue;
            const params = match(layer.path, req.path, layer.method !== null);
            if (!params) continue;
            if (Boolean(err) !== isErrorHandler) continue;
            req.params = params;
            try {
              const out = err ? layer.fn(err, req, res, next) : layer.fn(req, res, next);
              // Comme Express 5 : une promesse rejetée est transmise aux gestionnaires d'erreurs.
              if (out && typeof out.catch === "function") out.catch(next);
            } catch (e) {
              next(e);
            }
            return;
          }
          // Plus rien dans la pile : comportement par défaut d'Express
          if (res.sent) return;
          if (err) res.status(500).send(`<pre>${err.stack ?? err}</pre>`);
          else res.status(404).send(`Cannot ${req.method} ${req.path}`);
        };

        next();
        // Personne n'a répondu ni appelé next() : la requête reste pendue.
        setTimeout(() => {
          if (!res.sent) resolve({ status: 504, body: "Délai dépassé : aucune réponse envoyée", headers: {} });
        }, 200);
      });
    },
  };
  return app;
}

function match(pattern, path, exact) {
  if (pattern === null) return {};
  const p = pattern.split("/").filter(Boolean);
  const s = path.split("?")[0].split("/").filter(Boolean);
  if (exact ? p.length !== s.length : p.length > s.length) return null;
  const params = {};
  for (let k = 0; k < p.length; k++) {
    if (p[k].startsWith(":")) params[p[k].slice(1)] = decodeURIComponent(s[k]);
    else if (p[k] !== s[k]) return null;
  }
  return params;
}
