export function isValidHttpUrl(testUrl: string): boolean {
  let url;

  try {
    url = new URL(testUrl);
  } catch (e) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}