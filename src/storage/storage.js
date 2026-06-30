const STORAGE_KEY = "cricket-app:matches";

export function loadMatches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMatches(matches) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  } catch {
    // storage may be full or disabled - app still works in-memory
  }
}
