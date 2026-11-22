import { sendEmail } from "./mailer.js";

export async function notifyAll(users) {
  let sent = 0;

  users.forEach(async (user) => {
    await sendEmail(user.email, "Nouvelle fonctionnalité disponible");
    sent++;
  });

  return sent;
}
