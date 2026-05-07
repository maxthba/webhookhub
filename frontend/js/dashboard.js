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

function setModalOpen(isOpen) {
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

async function createWebhook(token, description) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function appendWebhookCard(webhook) {
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
