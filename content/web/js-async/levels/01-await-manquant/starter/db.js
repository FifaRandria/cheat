// Simule une base de données : chaque requête prend quelques millisecondes.
const users = new Map([
  [1, { id: 1, name: "Ada", email: "ada@example.com", plan: "pro" }],
  [2, { id: 2, name: "Linus", email: "linus@example.com", plan: "free" }],
]);

export async function findUserById(id) {
  await new Promise((resolve) => setTimeout(resolve, 5));
  return users.get(id) ?? null;
}
