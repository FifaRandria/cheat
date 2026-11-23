/**
 * Types partagés entre l'API, le runner et le frontend.
 * Ce paquet ne contient que des types : il n'existe pas à l'exécution.
 */

// ---------------------------------------------------------------------------
// Contenu pédagogique (dossier content/)
// ---------------------------------------------------------------------------

export type Phase = "MVP" | "V1" | "V2" | "V3";

/** bug-hunt : code cassé · quiz : questions/mises en situation · ordering : étapes à remettre dans l'ordre */
export type LevelType = "bug-hunt" | "quiz" | "ordering";

export type Runtime = "node" | "python";

export interface ModuleConfig {
  id: string;
  code: string; // "W0", "IA2", "GP1"…
  title: string;
  tagline: string;
  notions: string[];
  phase: Phase;
}

export interface TrackConfig {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  modules: ModuleConfig[];
}

/** Question à choix unique (quiz de niveau ou auto-évaluation de leçon). */
export interface QuestionConfig {
  prompt: string;
  choices: string[];
  /** Index de la bonne réponse */
  answer: number;
  /** Explication affichée une fois la question réussie */
  explain?: string;
  /** Piste affichée en cas d'erreur (sans donner la réponse) */
  hint?: string;
}

export interface StepConfig {
  label: string;
  detail?: string;
}

/** Contenu d'un fichier level.yml. */
export interface LevelConfig {
  id: string;
  title: string;
  order: number;
  type: LevelType;
  runtime: Runtime;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xp: number;
  blackout: boolean;
  hintCost: number;
  bugType: string;
  /** Fichier ouvert par défaut (bug-hunt) */
  entry: string;
  brief: string;
  logs?: string;
  hints: string[];
  /** Leçons à relire pour réussir ce niveau */
  lessons: string[];
  /** quiz */
  questions: QuestionConfig[];
  /** ordering, dans le bon ordre */
  steps: StepConfig[];
}

/** En-tête YAML d'une leçon (fichier .md). */
export interface LessonFrontmatter {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  xp: number;
  check: QuestionConfig[];
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
  files: SourceFile[];
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
  output: string;
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

export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  minutes: number;
  summary: string;
  completed: boolean;
}

export interface ModuleSummary {
  id: string;
  trackId: string;
  code: string;
  title: string;
  tagline: string;
  notions: string[];
  phase: Phase;
  order: number;
  lessons: LessonSummary[];
  levels: LevelSummary[];
  lessonsDone: number;
  solvedCount: number;
}

export interface TrackSummary {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  order: number;
  modules: ModuleSummary[];
}

export interface CheckQuestion {
  prompt: string;
  choices: string[];
  answer: number;
  explain: string | null;
}

export interface LessonDetail extends LessonSummary {
  xp: number;
  body: string;
  check: CheckQuestion[];
  module: { id: string; code: string; title: string };
  track: { id: string; title: string };
  /** Leçons du même module, pour la navigation latérale */
  siblings: LessonSummary[];
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  /** Premier niveau non résolu du module, pour « passer à la pratique » */
  practice: { id: string; title: string } | null;
}

export interface LessonCompleteResponse {
  xpGained: number;
  user: PublicUser;
  newBadges: Badge[];
}

export type InteractivePayload =
  | { kind: "quiz"; questions: Array<{ prompt: string; choices: string[] }> }
  | { kind: "ordering"; steps: Array<{ id: string; label: string; detail: string | null }> };

/** Réponse d'un joueur selon le type de niveau. */
export type Submission = { files: SourceFile[] } | { answers: number[] } | { order: string[] };

export interface LevelDetail extends LevelSummary {
  module: { id: string; code: string; title: string };
  track: { id: string; title: string };
  brief: string;
  logs: string | null;
  entry: string;
  runtime: Runtime;
  files: SourceFile[];
  interactive: InteractivePayload | null;
  lessons: Array<{ id: string; title: string }>;
  hintCost: number;
  hintsTotal: number;
  hintsUnlocked: string[];
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
  /** Révision du musée de bugs réussie à la date prévue */
  reviewed: boolean;
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
    lessonsDone: number;
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

export interface ReviewItem {
  level: LevelSummary & { moduleCode: string; trackId: string };
  bugType: string;
  occurrences: number;
  /** Boîte de Leitner : 0 = pas encore réparé, puis 1 à 4 et plus */
  box: number;
  nextReviewAt: string;
  lastSeenAt: string;
}

export interface ReviewResponse {
  /** À revoir maintenant : niveaux jamais réparés, ou dont la date de révision est passée */
  due: ReviewItem[];
  upcoming: ReviewItem[];
  reviewXp: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
