import { findUserById } from "./db.js";

export async function getProfile(id) {
  const user = await findUserById(id);

  if (!user) {
    throw new Error(`Utilisateur ${id} introuvable`);
  }

  return { name: user.name, plan: user.plan };
}
