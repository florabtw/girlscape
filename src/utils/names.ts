export function normalizeRsn(rsn: string) {
  return rsn.toLowerCase().replaceAll("-", " ");
}
