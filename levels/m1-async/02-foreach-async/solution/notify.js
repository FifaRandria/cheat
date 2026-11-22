import { sendEmail } from "./mailer.js";

export async function notifyAll(users) {
  await Promise.all(
    users.map((user) => sendEmail(user.email, "Nouvelle fonctionnalité disponible")),
  );
  return users.length;
}
