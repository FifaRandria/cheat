export function emailsPremium(clients) {
  const emails = [];

  for (const client of clients) {
    if (client.premium === true) {
      emails.push(client.email);
    }
  }

  return emails;
}
