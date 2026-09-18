const GNEWS_API_BASE_URL = "https://gnews.io/api/v4";

const TOP_HEADLINES_CACHE_KEY = "gnews_top_headlines_cache";
const SEARCH_CACHE_PREFIX = "gnews_search_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let topHeadlinesRequest = null;
const searchRequests = new Map();

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNews API key is missing.");
  }

  return apiKey;
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${GNEWS_API_BASE_URL}${endpoint}`);

  url.searchParams.set("token", getApiKey());
  url.searchParams.set("lang", "en");
  url.searchParams.set("country", "in");
  url.searchParams.set("max", "5");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "News API rate limit reached. Please try again after a few minutes."
      );
    }

    const errorMessage =
      typeof data?.errors?.[0] === "string"
        ? data.errors[0]
        : data?.errors?.[0]?.message || data?.message;

    throw new Error(errorMessage || "Failed to fetch news.");
  }

  return data;
};

const getCachedData = (key) => {
  try {
    const cached = sessionStorage.getItem(key);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (!parsed?.timestamp || Date.now() - parsed.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignore storage errors.
  }
};

export const fetchTopHeadlines = async () => {
  const cachedData = getCachedData(TOP_HEADLINES_CACHE_KEY);

  if (cachedData) {
    return cachedData;
  }

  if (topHeadlinesRequest) {
    return topHeadlinesRequest;
  }

  topHeadlinesRequest = (async () => {
    try {
      const url = buildUrl("/top-headlines");
      const response = await fetch(url);
      const data = await parseResponse(response);

      const articles = Array.isArray(data.articles) ? data.articles : [];

      setCachedData(TOP_HEADLINES_CACHE_KEY, articles);

      return articles;
    } catch (error) {
      throw new Error(error?.message || "Unable to load top headlines.");
    } finally {
      topHeadlinesRequest = null;
    }
  })();

  return topHeadlinesRequest;
};

export const searchNewsByKeyword = async (query) => {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    throw new Error("Search query is required.");
  }

  const cacheKey = `${SEARCH_CACHE_PREFIX}${trimmedQuery.toLowerCase()}`;

  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  if (searchRequests.has(cacheKey)) {
    return searchRequests.get(cacheKey);
  }

  const request = (async () => {
    try {
      const url = buildUrl("/search", {
        q: trimmedQuery,
      });

      const response = await fetch(url);
      const data = await parseResponse(response);

      const articles = Array.isArray(data.articles) ? data.articles : [];

      setCachedData(cacheKey, articles);

      return articles;
    } catch (error) {
      throw new Error(error?.message || "Unable to search news.");
    } finally {
      searchRequests.delete(cacheKey);
    }
  })();

  searchRequests.set(cacheKey, request);

  return request;
};

export default {
  fetchTopHeadlines,
  searchNewsByKeyword,
};