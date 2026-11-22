import bcrypt from "bcryptjs";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { githubCallback, githubStart } from "../auth/github.js";
import { closeSession, openSession } from "../auth/session.js";
import { db } from "../db.js";
import { env } from "../env.js";
import { toPublicUser } from "../game/progression.js";
import { HttpError } from "../http.js";

export const authRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Patiente quelques minutes." },
});

const email = z.string().trim().toLowerCase().email("Adresse e-mail invalide");

const registerSchema = z.object({
  email,
  displayName: z.string().trim().min(2, "Ton pseudo doit faire au moins 2 caractères").max(32),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères").max(200),
});

const loginSchema = z.object({ email, password: z.string().min(1, "Mot de passe requis") });

authRouter.get("/providers", (_req, res) => {
  res.json({ email: true, github: env.githubEnabled });
});

authRouter.post("/register", limiter, async (req, res) => {
  const data = registerSchema.parse(req.body);
  if (await db.user.findUnique({ where: { email: data.email } })) {
    throw new HttpError(409, "Un compte existe déjà avec cette adresse.");
  }
  const user = await db.user.create({
    data: {
      email: data.email,
      displayName: data.displayName,
      passwordHash: await bcrypt.hash(data.password, 12),
    },
  });
  openSession(res, user.id);
  res.status(201).json({ user: toPublicUser(user) });
});

authRouter.post("/login", limiter, async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await db.user.findUnique({ where: { email: data.email } });
  const valid = user?.passwordHash ? await bcrypt.compare(data.password, user.passwordHash) : false;
  if (!user || !valid) {
    throw new HttpError(
      401,
      user && !user.passwordHash ? "Ce compte utilise la connexion GitHub." : "E-mail ou mot de passe incorrect.",
    );
  }
  openSession(res, user.id);
  res.json({ user: toPublicUser(user) });
});

authRouter.post("/logout", (_req, res) => {
  closeSession(res);
  res.status(204).end();
});

authRouter.get("/github", githubStart);
authRouter.get("/github/callback", githubCallback);
