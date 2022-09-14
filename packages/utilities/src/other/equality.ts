export function isEqual<T>(a: T, b: T) {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
  }

  return JSON.stringify(a) === JSON.stringify(b);
}
