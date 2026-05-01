export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_STORYCRAFT_API_URL?.trim();

  if (!configuredUrl) {
    return "/api";
  }

  const withoutTrailingSlash = configuredUrl.replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  if (withoutTrailingSlash === window.location.origin) {
    return `${withoutTrailingSlash}/api`;
  }

  try {
    const url = new URL(withoutTrailingSlash);
    if (url.pathname === "" || url.pathname === "/") {
      return `${withoutTrailingSlash}/api`;
    }
  } catch {
    if (withoutTrailingSlash === "") {
      return "/api";
    }
  }

  return withoutTrailingSlash;
}
