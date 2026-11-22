import { defaultSources } from "./services.js";

export async function buildDashboard(sources = defaultSources) {
  const names = Object.keys(sources);
  const results = await Promise.all(names.map((name) => sources[name]()));

  const widgets = {};
  names.forEach((name, i) => {
    widgets[name] = { status: "up", data: results[i] };
  });

  return widgets;
}
