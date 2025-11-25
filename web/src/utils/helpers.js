// Extract ID from SWAPI URL (e.g., "https://swapi.dev/api/people/1/" -> "1")
export const extractId = (url) => {
  if (!url) return null;
  const matches = url.match(/\/(\d+)\/?$/);
  return matches ? matches[1] : null;
};