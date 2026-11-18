import redirects from "../../legacy/redirects.generated.json";

export function getLegacyRedirect(request: URL) {
  const match = redirects.find((item) => {
    const legacy = new URL(item.from, "http://legacy.invalid");
    if (legacy.pathname !== request.pathname) return false;
    for (const [key, value] of legacy.searchParams) {
      if (request.searchParams.get(key) !== value) return false;
    }
    return true;
  });
  return match?.to;
}
