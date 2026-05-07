export function formatDate(value) {
  if (!value) return "";
  if (value._seconds) return new Date(value._seconds * 1000).toLocaleString();
  return new Date(value).toLocaleString();
}

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}