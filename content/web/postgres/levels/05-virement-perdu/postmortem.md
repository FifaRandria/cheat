## Cause racine

Le virement faisait **deux** opérations indépendantes : le débit, puis le crédit. Quand le
crédit échouait (compte destinataire inexistant), l'erreur était bien levée… mais le débit
avait **déjà été enregistré**. L'argent quittait un compte sans jamais arriver nulle part.

Deux cas passaient aussi entre les mailles :

- un compte **source** inexistant : le débit ne touchait aucune ligne (`changes === 0`), et le
  crédit fabriquait de l'argent à partir de rien ;
- un solde insuffisant était bien refusé par la contrainte `CHECK (solde >= 0)`, heureusement.

## Correctif

Une **transaction**, qui rend l'ensemble indivisible, et la vérification des deux `changes` :

```js
db.exec("BEGIN");
try {
  // débit, avec vérification de changes
  // crédit, avec vérification de changes
  db.exec("COMMIT");
} catch (erreur) {
  db.exec("ROLLBACK"); // annule aussi le débit déjà fait
  throw erreur;
}
```

## Le réflexe à garder

- Dès qu'une opération métier touche **plusieurs** lignes ou tables qui doivent rester
  cohérentes : transaction.
- Un `UPDATE` sur une ligne absente ne lève pas d'erreur : vérifie `changes`.
- Écris un test d'**invariant** (« la somme des soldes ne change jamais ») : il attrape des
  bugs qu'aucun test de cas particulier n'aurait vus.
- Avec Prisma, c'est `prisma.$transaction([...])`. Le principe est identique.
