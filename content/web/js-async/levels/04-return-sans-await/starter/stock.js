// Simule la base de données des stocks.
const stock = { clavier: 12, souris: 30, "écran-4k": 0 };
let prochainId = 1;

export async function enregistrer(panier) {
  await new Promise((resolve) => setTimeout(resolve, 5));
  for (const article of panier) {
    if (!stock[article]) {
      throw new Error(`Stock insuffisant pour ${article}`);
    }
  }
  return { id: prochainId++ };
}
