import { escapeHtml } from "./utils.js";

export function redirectToLogin() {
  window.location.href = "../pages/login.html";
}

export function setModalOpen(isOpen) {
  const modal = document.getElementById("create-webhook-modal");
  const messageEl = document.getElementById("create-webhook-message");
  const input = document.getElementById("webhook-name");

  if (!modal) return;

  modal.classList.toggle("hidden", !isOpen);
  modal.setAttribute("aria-hidden", String(!isOpen));

  if (!isOpen && messageEl) {
    messageEl.textContent = "";
    messageEl.classList.remove("error", "success");
  }

  if (isOpen && input) {
    window.setTimeout(() => input.focus(), 0);
  }
}

export function appendWebhookCard(webhook) {
  const cards = document.getElementById("cards");
  const contentEl = document.getElementById("content");

  if (!cards || !contentEl) return;

  const emptyEl = contentEl.querySelector(".empty");
  if (emptyEl) {
    emptyEl.remove();
  }

  const a = document.createElement("a");
  a.className = "webhook-card";
  a.href = `../pages/webhook.html?id=${encodeURIComponent(webhook.id)}`;
  a.innerHTML = `
    <h3>${webhook.description ? escapeHtml(webhook.description) : escapeHtml(webhook.id)}</h3>
    <p>ID: ${escapeHtml(webhook.id)}</p>
    <small>Criado agora</small>
  `;
  cards.prepend(a);
}