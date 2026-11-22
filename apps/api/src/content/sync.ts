import { db } from "../db.js";
import { BADGES, moduleBadgeSlug } from "../game/badges.js";
import { getContent } from "./loader.js";

/**
 * Recopie le contenu pédagogique (fichiers YAML) dans la base de données.
 * Idempotent : peut être lancé à chaque démarrage.
 */
export async function syncContent() {
  const { modules, levels } = await getContent();

  await db.$transaction(async (tx) => {
    for (const [order, m] of modules.entries()) {
      const data = { code: m.code, title: m.title, tagline: m.tagline, notions: m.notions, phase: m.phase, order };
      await tx.module.upsert({ where: { id: m.id }, create: { id: m.id, ...data }, update: data });
    }

    for (const { config: l, relPath } of levels.values()) {
      const data = {
        moduleId: l.module,
        path: relPath,
        title: l.title,
        order: l.order,
        type: l.type,
        runtime: l.runtime,
        difficulty: l.difficulty,
        xp: l.xp,
        blackout: l.blackout,
        hintCost: l.blackout ? 0 : l.hintCost,
        hintsCount: l.blackout ? 0 : l.hints.length,
        bugType: l.bugType,
        active: true,
      };
      await tx.level.upsert({ where: { id: l.id }, create: { id: l.id, ...data }, update: data });
    }

    await tx.level.updateMany({ where: { id: { notIn: [...levels.keys()] } }, data: { active: false } });

    const modulesWithLevels = new Set([...levels.values()].map((l) => l.config.module));
    const badges = [
      ...BADGES,
      ...modules
        .filter((m) => modulesWithLevels.has(m.id))
        .map((m) => ({
          slug: moduleBadgeSlug(m.id),
          name: `${m.code} bouclé`,
          description: `Réparer tous les niveaux du module ${m.code} · ${m.title}.`,
          icon: "flag",
        })),
    ];
    for (const b of badges) {
      await tx.badge.upsert({ where: { slug: b.slug }, create: b, update: b });
    }
  });

  return { modules: modules.length, levels: levels.size };
}
