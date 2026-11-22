import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { db } from "../db.js";
import { env } from "../env.js";
import { HttpError } from "../http.js";
import { openSession } from "./session.js";

const STATE_COOKIE = "rustine_oauth_state";

/** GET /api/auth/github : redirige vers l'écran d'autorisation GitHub. */
export function githubStart(_req: Request, res: Response) {
  if (!env.githubEnabled) throw new HttpError(404, "La connexion GitHub n'est pas configurée.");
  const state = randomBytes(16).toString("hex");
  res.cookie(STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", secure: env.isProd, maxAge: 10 * 60 * 1000 });
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", `${env.WEB_URL}/api/auth/github/callback`);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  res.redirect(url.toString());
}

/** GET /api/auth/github/callback : échange le code, crée ou relie le compte, ouvre la session. */
export async function githubCallback(req: Request, res: Response) {
  const fail = (reason: string) => res.redirect(`${env.WEB_URL}/connexion?erreur=${encodeURIComponent(reason)}`);
  const { code, state } = req.query as { code?: string; state?: string };
  const expected = req.cookies?.[STATE_COOKIE] as string | undefined;
  res.clearCookie(STATE_COOKIE);

  if (!env.githubEnabled) return fail("GitHub n'est pas configuré.");
  if (!code || !state || state !== expected) return fail("La demande a expiré, réessaie.");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
  });
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) return fail("GitHub a refusé l'autorisation.");

  const gh = async <T>(path: string) =>
    (await fetch(`https://api.github.com${path}`, {
      headers: { authorization: `Bearer ${access_token}`, accept: "application/vnd.github+json", "user-agent": "rustine" },
    }).then((r) => r.json())) as T;

  const profile = await gh<{ id: number; login: string; name: string | null; avatar_url: string }>("/user");
  const emails = await gh<Array<{ email: string; primary: boolean; verified: boolean }>>("/user/emails");
  const email = emails.find((e) => e.primary && e.verified)?.email ?? emails.find((e) => e.verified)?.email;
  if (!email) return fail("Ton compte GitHub n'a aucune adresse e-mail vérifiée.");

  const githubId = String(profile.id);
  const existing =
    (await db.user.findUnique({ where: { githubId } })) ??
    (await db.user.findUnique({ where: { email: email.toLowerCase() } }));

  const user = existing
    ? await db.user.update({
        where: { id: existing.id },
        data: { githubId, avatarUrl: existing.avatarUrl ?? profile.avatar_url },
      })
    : await db.user.create({
        data: {
          email: email.toLowerCase(),
          displayName: profile.name ?? profile.login,
          githubId,
          avatarUrl: profile.avatar_url,
        },
      });

  openSession(res, user.id);
  res.redirect(`${env.WEB_URL}/parcours`);
}
