import { db } from "../db.js";
import { BADGES, moduleBadgeSlug } from "../game/badges.js";
import { getContent } from "./loader.js";

/**
 * Recopie le contenu pédagogique (YAML et Markdown) dans la base de données.
 * Idempotent : lancé à chaque démarrage de l'API.
 */
export async function syncContent() {
  const { tracks, modules, levels, lessons } = await getContent();

  await db.$transaction(
    async (tx) => {
      for (const t of tracks) {
        const data = { title: t.title, tagline: t.tagline, description: t.description, icon: t.icon, order: t.order, active: true };
        await tx.track.upsert({ where: { id: t.id }, create: { id: t.id, ...data }, update: data });
      }
      await tx.track.updateMany({ where: { id: { notIn: tracks.map((t) => t.id) } }, data: { active: false } });

      for (const m of modules.values()) {
        const data = {
          trackId: m.trackId,
          code: m.code,
          title: m.title,
          tagline: m.tagline,
          notions: m.notions,
          phase: m.phase,
          order: m.order,
          active: true,
        };
        await tx.module.upsert({ where: { id: m.id }, create: { id: m.id, ...data }, update: data });
      }
      await tx.module.updateMany({ where: { id: { notIn: [...modules.keys()] } }, data: { active: false } });

      for (const l of levels.values()) {
        const c = l.config;
        const noHints = c.blackout;
        const data = {
          moduleId: l.moduleId,
          path: l.relPath,
          title: c.title,
          order: c.order,
          type: c.type,
          runtime: c.runtime,
          difficulty: c.difficulty,
          xp: c.xp,
          blackout: c.blackout,
          hintCost: noHints ? 0 : c.hintCost,
          hintsCount: noHints ? 0 : c.hints.length,
          bugType: c.bugType,
          active: true,
        };
        await tx.level.upsert({ where: { id: c.id }, create: { id: c.id, ...data }, update: data });
      }
      await tx.level.updateMany({ where: { id: { notIn: [...levels.keys()] } }, data: { active: false } });

      for (const l of lessons.values()) {
        const data = {
          moduleId: l.moduleId,
          path: l.relPath,
          title: l.meta.title,
          order: l.order,
          minutes: l.meta.minutes,
          summary: l.meta.summary,
          xp: l.meta.xp,
          active: true,
        };
        await tx.lesson.upsert({ where: { id: l.meta.id }, create: { id: l.meta.id, ...data }, update: data });
      }
      await tx.lesson.updateMany({ where: { id: { notIn: [...lessons.keys()] } }, data: { active: false } });

      const modulesWithLevels = new Set([...levels.values()].map((l) => l.moduleId));
      const badges = [
        ...BADGES,
        ...[...modules.values()]
          .filter((m) => modulesWithLevels.has(m.id))
          .map((m) => ({
            slug: moduleBadgeSlug(m.id),
            name: `${m.code} bouclé`,
            description: `Réussir tous les niveaux du module ${m.code} · ${m.title}.`,
            icon: "flag",
          })),
      ];
      for (const b of badges) {
        await tx.badge.upsert({ where: { slug: b.slug }, create: b, update: b });
      }
    },
    { timeout: 30_000 },
  );

  return { tracks: tracks.length, modules: modules.size, levels: levels.size, lessons: lessons.size };
}
