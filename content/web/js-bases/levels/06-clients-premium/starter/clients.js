// Renvoie les e-mails des clients premium
export function emailsPremium(clients) {
  const emails = [];

  for (const client of clients) {
    if (client.Premium === true) {
      emails.push(client.mail);
    }
  }

  return emails;
}
