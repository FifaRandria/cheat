import { createApp } from "./mini-express.js";

const produits = [
  { id: 1, nom: "Clavier", prix: 49 },
  { id: 2, nom: "Souris", prix: 25 },
];

export const app = createApp();

app.get("/produits/:id", (req, res) => {
  const produit = produits.find((p) => p.id === Number(req.params.id));
  if (!produit) {
    return res.status(404).json({ error: "Produit introuvable" });
  }
  res.json(produit);
});
