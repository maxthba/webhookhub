import { createWebhook, fetchWebhooks } from "./dashboard/api.js";
import { escapeHtml, formatDate } from "./dashboard/utils.js";
import { appendWebhookCard, redirectToLogin, setModalOpen } from "./dashboard/ui.js";

async function init() {
  const token = localStorage.getItem("authToken");
  if (!token) return redirectToLogin();

  const loadingEl = document.getElementById("loading");
  const contentEl = document.getElementById("content");

  try {
    const webhooks = await fetchWebhooks(token);
    loadingEl.style.display = "none";

    if (!webhooks || webhooks.length === 0) {
      contentEl.innerHTML = '<p class="empty">Nenhum webhook criado.</p><div class="cards" id="cards"></div>';
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

document.getElementById("btn-create-webhook").addEventListener("click", () => {
  setModalOpen(true);
});

document.getElementById("btn-close-modal").addEventListener("click", () => {
  setModalOpen(false);
});

document.getElementById("btn-cancel-create").addEventListener("click", () => {
  setModalOpen(false);
});

document.getElementById("create-webhook-modal").addEventListener("click", (event) => {
  if (event.target.id === "create-webhook-modal") {
    setModalOpen(false);
  }
});

document.getElementById("create-webhook-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("authToken");
  const input = document.getElementById("webhook-name");
  const messageEl = document.getElementById("create-webhook-message");
  const submitButton = document.getElementById("btn-submit-create");
  const description = input.value.trim();

  if (!token) return redirectToLogin();
  if (!description) {
    messageEl.textContent = "Informe o nome do webhook.";
    messageEl.classList.remove("success");
    messageEl.classList.add("error");
    input.focus();
    return;
  }

  try {
    submitButton.disabled = true;
    messageEl.textContent = "Criando webhook...";
    messageEl.classList.remove("error");
    messageEl.classList.remove("success");

    const webhook = await createWebhook(token, description);

    appendWebhookCard({
      id: webhook.id,
      description,
    });

    messageEl.textContent = "Webhook criado com sucesso.";
    messageEl.classList.remove("error");
    messageEl.classList.add("success");

    input.value = "";

    window.setTimeout(() => setModalOpen(false), 700);
  } catch (err) {
    if (err.message === "unauthorized") {
      localStorage.removeItem("authToken");
      return redirectToLogin();
    }

    messageEl.textContent = `Erro ao criar webhook: ${err.message}`;
    messageEl.classList.remove("success");
    messageEl.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

init();
