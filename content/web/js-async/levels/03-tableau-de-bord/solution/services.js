// Sources de données du tableau de bord (simulées).
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWeather() {
  await delay(10);
  return { city: "Antananarivo", temp: 24 };
}

export async function fetchStocks() {
  await delay(10);
  throw new Error("connect ECONNREFUSED 10.0.3.7:8080");
}

export async function fetchNews() {
  await delay(15);
  return [{ title: "Le module Docker arrive bientôt" }];
}

export const defaultSources = {
  weather: fetchWeather,
  stocks: fetchStocks,
  news: fetchNews,
};
