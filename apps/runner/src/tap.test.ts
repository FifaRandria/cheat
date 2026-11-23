import { describe, expect, it } from "vitest";
import { parseTap } from "./tap.js";

const SAMPLE = `TAP version 13
# hello from player
# Subtest: renvoie le nombre d'e-mails envoyés
not ok 1 - renvoie le nombre d'e-mails envoyés
  ---
  duration_ms: 3.5351
  type: 'test'
  failureType: 'testCodeFailure'
  error: |-
    Expected values to be strictly equal:

    0 !== 3

  code: 'ERR_ASSERTION'
  ...
# Subtest: une liste vide n'envoie rien
ok 2 - une liste vide n'envoie rien
  ---
  duration_ms: 0.3614
  type: 'test'
  ...
1..2
# tests 2
# pass 1
# fail 1
# duration_ms 78.4684
`;

describe("parseTap", () => {
  const { tests, logs } = parseTap(SAMPLE);

  it("lit chaque test de premier niveau avec son statut", () => {
    expect(tests.map((t) => [t.name, t.ok])).toEqual([
      ["renvoie le nombre d'e-mails envoyés", false],
      ["une liste vide n'envoie rien", true],
    ]);
  });

  it("extrait le message d'erreur multiligne d'un test en échec", () => {
    expect(tests[0]?.message).toBe("Expected values to be strictly equal:\n\n0 !== 3");
  });

  it("arrondit la durée au dixième de milliseconde", () => {
    expect(tests[0]?.durationMs).toBe(3.5);
    expect(tests[1]?.message).toBeUndefined();
  });

  it("remonte les console.log du joueur mais pas le résumé ni les « Subtest »", () => {
    expect(logs).toEqual(["hello from player"]);
  });

  it("lit une erreur sur une seule ligne et un nom échappé", () => {
    const r = parseTap("not ok 1 - test \\# 1\n  ---\n  error: 'test failed'\n  ...\n");
    expect(r.tests[0]).toMatchObject({ name: "test # 1", ok: false, message: "test failed" });
  });

  it("renvoie une liste vide pour une sortie sans test (erreur de syntaxe)", () => {
    expect(parseTap("SyntaxError: Unexpected token\n").tests).toEqual([]);
  });
});
