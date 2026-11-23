import { createApp } from "./mini-express.js";

export const comptes = [];
export const app = createApp();

app.post("/inscriptions", (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Données invalides", details: ["email invalide"] });
  }

  comptes.push({ email, motDePasse });
  res.status(201).json({ email, motDePasse });
});
