/**
 * Types partagés entre l'API, le runner et le frontend.
 * Ce paquet ne contient que des types : il n'existe pas à l'exécution.
 */

// ---------------------------------------------------------------------------
// Contenu pédagogique (fichiers du dossier levels/)
// ---------------------------------------------------------------------------

export type Phase = "MVP" | "V1" | "V2" | "V3";

export type LevelType = "bug-hunt" | "quiz" | "ordering" | "simulation";

export type Runtime = "node" | "python";

/** Contenu de levels/modules.yml (une entrée par module). */
export interface ModuleConfig {
  id: string;
  code: string; // "M0", "M1"…
  title: string;
  tagline: string;
  notions: string[];
  phase: Phase;
}

/** Contenu d'un fichier level.yml. */
export interface LevelConfig {
  id: string;
  title: string;
  module: string;
  order: number;
  type: LevelType;
  runtime: Runtime;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xp: number;
  blackout: boolean;
  /** XP retirée de la récompense pour chaque indice débloqué. */
  hintCost: number;
  /** Famille de bug, utilisée par le musée de bugs. */
  bugType: string;
  /** Fichier ouvert par défaut dans l'éditeur. */
  entry: string;
  /** Énoncé, en Markdown. */
  brief: string;
  /** Extrait de logs « de production » affiché au joueur. */
  logs?: string;
  hints: string[];
  tests: string;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

export interface SourceFile {
  path: string;
  content: string;
}

export interface RunRequest {
  runtime: Runtime;
  /** Code du joueur, placé dans src/. */
  files: SourceFile[];
  /** Tests de validation, placés dans tests/. Jamais modifiables par le joueur. */
  tests: SourceFile[];
}

export interface TestCaseResult {
  name: string;
  ok: boolean;
  durationMs?: number;
  message?: string;
}

export interface RunResult {
  ok: boolean;
  passed: number;
  failed: number;
  total: number;
  durationMs: number;
  timedOut: boolean;
  tests: TestCaseResult[];
  /** Sortie brute (stdout + stderr), tronquée. */
  output: string;
  /** Erreur d'infrastructure (runner indisponible…), distincte d'un test rouge. */
  error?: string;
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

export type LevelStatus = "todo" | "in-progress" | "solved";

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  rank: number;
  xpIntoRank: number;
  xpForNextRank: number;
  streak: number;
  bestStreak: number;
  githubLinked: boolean;
}

export interface LevelSummary {
  id: string;
  title: string;
  order: number;
  type: LevelType;
  difficulty: number;
  xp: number;
  blackout: boolean;
  bugType: string;
  status: LevelStatus;
}

export interface ModuleSummary {
  id: string;
  code: string;
  title: string;
  tagline: string;
  notions: string[];
  phase: Phase;
  order: number;
  levels: LevelSummary[];
  solvedCount: number;
}

export interface LevelDetail extends LevelSummary {
  module: { id: string; code: string; title: string };
  brief: string;
  logs: string | null;
  entry: string;
  files: SourceFile[];
  hintCost: number;
  hintsTotal: number;
  hintsUnlocked: string[];
  /** Récompense restante compte tenu des indices déjà débloqués. */
  reward: number;
  attempts: number;
  postmortem: string | null;
  next: { id: string; title: string } | null;
}

export interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

export interface SubmitResponse {
  result: RunResult;
  solved: boolean;
  firstSolve: boolean;
  xpGained: number;
  user: PublicUser | null;
  newBadges: Badge[];
  postmortem: string | null;
  next: { id: string; title: string } | null;
}

export interface HintResponse {
  hintsUnlocked: string[];
  reward: number;
}

export interface ProfileResponse {
  user: PublicUser;
  badges: Badge[];
  stats: {
    solved: number;
    attempts: number;
    hintsUsed: number;
    blackoutSolved: number;
  };
  museum: Array<{
    levelId: string;
    levelTitle: string;
    bugType: string;
    occurrences: number;
    nextReviewAt: string;
  }>;
  recent: Array<{
    levelId: string;
    levelTitle: string;
    passed: boolean;
    createdAt: string;
  }>;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
