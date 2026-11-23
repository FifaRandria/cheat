import type {
  HintResponse,
  LessonCompleteResponse,
  LessonDetail,
  LevelDetail,
  ProfileResponse,
  PublicUser,
  ReviewResponse,
  SourceFile,
  Submission,
  SubmitResponse,
  TrackSummary,
} from "@rustine/shared";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      credentials: "same-origin",
      headers: { ...(init.body ? { "content-type": "application/json" } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur. Vérifie ta connexion.");
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const fallback =
      res.status >= 500 ? "Le serveur ne répond pas correctement. L'API est-elle démarrée ?" : `Erreur ${res.status}`;
    throw new ApiError(res.status, body?.error ?? fallback, body?.details);
  }
  return body as T;
}

const json = (data: unknown) => JSON.stringify(data);

export const api = {
  me: () => request<PublicUser>("/me"),
  profile: () => request<ProfileResponse>("/me/profile"),
  deleteAccount: () => request<void>("/me", { method: "DELETE" }),

  providers: () => request<{ email: boolean; github: boolean }>("/auth/providers"),
  register: (data: { email: string; displayName: string; password: string }) =>
    request<{ user: PublicUser }>("/auth/register", { method: "POST", body: json(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ user: PublicUser }>("/auth/login", { method: "POST", body: json(data) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),

  tracks: () => request<TrackSummary[]>("/tracks"),
  lesson: (id: string) => request<LessonDetail>(`/lessons/${encodeURIComponent(id)}`),
  completeLesson: (id: string) =>
    request<LessonCompleteResponse>(`/lessons/${encodeURIComponent(id)}/complete`, { method: "POST" }),
  level: (id: string, opts: { fresh?: boolean } = {}) =>
    request<LevelDetail>(`/levels/${encodeURIComponent(id)}${opts.fresh ? "?fresh=1" : ""}`),
  review: () => request<ReviewResponse>("/me/review"),
  reviewCount: () => request<{ due: number }>("/me/review/count"),
  starter: (id: string) => request<SourceFile[]>(`/levels/${encodeURIComponent(id)}/starter`),
  saveDraft: (id: string, files: SourceFile[]) =>
    request<void>(`/levels/${encodeURIComponent(id)}/draft`, { method: "PUT", body: json({ files }) }),
  unlockHint: (id: string) => request<HintResponse>(`/levels/${encodeURIComponent(id)}/hints`, { method: "POST" }),
  submit: (id: string, submission: Submission) =>
    request<SubmitResponse>(`/levels/${encodeURIComponent(id)}/submit`, { method: "POST", body: json(submission) }),
};
