export function fmtDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}
export function nextStudentId(seq: number, year = new Date().getFullYear()) {
  return `SDSA-${year}-${String(seq).padStart(3, '0')}`;
}
export function nextCertNumber(seq: number, year = new Date().getFullYear()) {
  return `SDSA-CERT-${year}-${String(seq).padStart(4, '0')}`;
}
