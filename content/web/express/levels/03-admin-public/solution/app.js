import { createApp } from "./mini-express.js";

export const app = createApp();

function exigerAdmin(req, res, next) {
  const jeton = req.headers.authorization;
  if (!jeton) {
    return res.status(401).json({ error: "Connexion requise" });
  }
  if (jeton !== "Bearer jeton-admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
}

app.get("/catalogue", (req, res) => {
  res.json([{ id: 1, nom: "Clavier" }]);
});

// Le contrôle doit être déclaré AVANT les routes qu'il protège.
app.use("/admin", exigerAdmin);

app.get("/admin/stats", (req, res) => {
  res.json({ chiffreAffaires: 128400, clients: 912 });
});
