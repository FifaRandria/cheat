// Simule un service d'envoi d'e-mails.
export const outbox = [];

export async function sendEmail(to, subject) {
  await new Promise((resolve) => setTimeout(resolve, 10 + Math.random() * 10));
  outbox.push({ to, subject });
}
