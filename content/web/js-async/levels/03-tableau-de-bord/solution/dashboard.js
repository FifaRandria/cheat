import { defaultSources } from "./services.js";

export async function buildDashboard(sources = defaultSources) {
  const names = Object.keys(sources);
  const results = await Promise.allSettled(names.map((name) => sources[name]()));

  const widgets = {};
  names.forEach((name, i) => {
    const result = results[i];
    widgets[name] =
      result.status === "fulfilled"
        ? { status: "up", data: result.value }
        : { status: "down", error: result.reason?.message ?? String(result.reason) };
  });

  return widgets;
}
