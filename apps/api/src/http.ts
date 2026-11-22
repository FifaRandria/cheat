import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export const notFound = (what = "Ressource") => new HttpError(404, `${what} introuvable`);

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: err.issues[0]?.message ?? "Données invalides",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return;
  }
  console.error("[api]", err);
  res.status(500).json({ error: "Erreur interne. L'incident a été journalisé." });
}
