import { createApp } from "./mini-express.js";

const produits = [
  { id: 1, nom: "Clavier", prix: 49 },
  { id: 2, nom: "Souris", prix: 25 },
];

export const app = createApp();

app.get("/produits/:id", (req, res) => {
  const produit = produits.find((p) => p.id == req.params.id);
  res.json(produit);
});
