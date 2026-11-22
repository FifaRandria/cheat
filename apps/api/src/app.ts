import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { loadUser } from "./auth/session.js";
import { errorHandler, notFound } from "./http.js";
import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { meRouter } from "./routes/me.js";
import { playRouter } from "./routes/play.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  // Derrière le proxy Next.js (et un reverse proxy en production)
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(express.json({ limit: "300kb" }));
  app.use(cookieParser());
  app.use(loadUser);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/me", meRouter);
  app.use("/api", catalogRouter);
  app.use("/api", playRouter);

  app.use((_req, _res) => {
    throw notFound("Route");
  });
  app.use(errorHandler);
  return app;
}
