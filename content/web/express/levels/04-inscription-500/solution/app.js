import { createApp } from "./mini-express.js";

export const comptes = [];
export const app = createApp();

function valider(body) {
  const details = [];
  if (typeof body?.email !== "string" || !body.email.includes("@")) {
    details.push("email invalide");
  }
  if (typeof body?.motDePasse !== "string" || body.motDePasse.length < 8) {
    details.push("mot de passe : 8 caractères minimum");
  }
  return details;
}

app.post("/inscriptions", (req, res) => {
  const details = valider(req.body);
  if (details.length > 0) {
    return res.status(400).json({ error: "Données invalides", details });
  }

  const { email, motDePasse } = req.body;
  comptes.push({ email, motDePasse });
  res.status(201).json({ email });
});
