import { describe, expect, it } from "vitest";
import { validateRequest, ValidationError } from "./sandbox.js";

const file = (path: string, content = "x") => ({ path, content });
const valid = { runtime: "node", files: [file("a.js")], tests: [file("a.test.js")] };

describe("validateRequest", () => {
  it("accepte une requête correcte", () => {
    expect(validateRequest(valid)).toEqual(valid);
  });

  it("accepte les sous-dossiers simples", () => {
    expect(() => validateRequest({ ...valid, files: [file("lib/util.js")] })).not.toThrow();
  });

  it.each(["../evil.js", "a/../../b.js", "/etc/passwd", "C:\\win.js", ".hidden", "a//b.js", ""])(
    "refuse le chemin dangereux %j",
    (path) => {
      expect(() => validateRequest({ ...valid, files: [file(path)] })).toThrow(ValidationError);
    },
  );

  it("refuse un runtime inconnu", () => {
    expect(() => validateRequest({ ...valid, runtime: "ruby" })).toThrow(/runtime/);
  });

  it("refuse un fichier sans contenu texte", () => {
    expect(() => validateRequest({ ...valid, files: [{ path: "a.js", content: 42 }] })).toThrow(ValidationError);
  });

  it("refuse trop de fichiers", () => {
    const files = Array.from({ length: 40 }, (_, i) => file(`f${i}.js`));
    expect(() => validateRequest({ ...valid, files })).toThrow(/Trop de fichiers/);
  });

  it("refuse un code trop volumineux", () => {
    expect(() => validateRequest({ ...valid, files: [file("a.js", "x".repeat(300 * 1024))] })).toThrow(/volumineux/);
  });

  it("refuse un corps absent", () => {
    expect(() => validateRequest(null)).toThrow(ValidationError);
  });
});
