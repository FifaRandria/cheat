import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { db } from "../db.js";
import { env } from "../env.js";
import { HttpError } from "../http.js";

export const SESSION_COOKIE = "rustine_session";
const MAX_AGE_S = 30 * 24 * 60 * 60;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function openSession(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: MAX_AGE_S });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    maxAge: MAX_AGE_S * 1000,
    path: "/",
  });
}

export function closeSession(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

/** Charge l'utilisateur si un cookie de session valide est présent. N'échoue jamais. */
export async function loadUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub?: string };
      if (payload.sub) req.user = (await db.user.findUnique({ where: { id: payload.sub } })) ?? undefined;
    } catch {
      // Jeton expiré ou falsifié : on continue en anonyme.
    }
  }
  next();
}

export function requireUser(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) throw new HttpError(401, "Connecte-toi pour continuer.");
  next();
}

/** Pour les handlers protégés par requireUser. */
export function currentUser(req: Request): User {
  if (!req.user) throw new HttpError(401, "Connecte-toi pour continuer.");
  return req.user;
}
