const API = "http://localhost:3000/webhooks";

function formatDate(value) {
  if (!value) return "";
  if (value._seconds) return new Date(value._seconds * 1000).toLocaleString();
  return new Date(value).toLocaleString();
}

// Basic HTML escape to avoid injection in inserted HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function redirectToLogin() {
  window.location.href = "../pages/login.html";
}

async function fetchWebhooks(token) {
  const res = await fetch(API, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function init() {
  const token = localStorage.getItem("authToken");
  if (!token) return redirectToLogin();

  const loadingEl = document.getElementById("loading");
  const contentEl = document.getElementById("content");

  try {
    const webhooks = await fetchWebhooks(token);
    loadingEl.style.display = "none";

    if (!webhooks || webhooks.length === 0) {
      contentEl.innerHTML = '<p class="empty">Nenhum webhook criado.</p>';
      return;
    }

    const cards = document.getElementById("cards");
    if (!cards) {
      contentEl.innerHTML = '<p class="empty">Erro interno: container de cards não encontrado.</p>';
      return;
    }

    webhooks.forEach((w) => {
      const a = document.createElement("a");
      a.className = "webhook-card";
      a.href = `../pages/webhook.html?id=${encodeURIComponent(w.id)}`;
      a.innerHTML = `
        <h3>${w.description ? escapeHtml(w.description) : escapeHtml(w.id)}</h3>
        <p>ID: ${escapeHtml(w.id)}</p>
        <small>Criado em: ${formatDate(w.createdAt)}</small>
      `;
      cards.appendChild(a);
    });
  } catch (err) {
    loadingEl.style.display = "none";
    if (err.message === "unauthorized") {
      localStorage.removeItem("authToken");
      return redirectToLogin();
    }
    contentEl.innerHTML = `<p class="empty">Erro ao carregar webhooks: ${err.message}</p>`;
  }
}

document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  redirectToLogin();
});

init();
