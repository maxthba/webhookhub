import { auth } from "./config/firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (event) => {
    // Evita que a página recarregue ao enviar o formulário
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const messageEl = document.getElementById("login-menssage");

    try {
        // 1. Faz o login no Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        
        console.log("Login efetuado com sucesso!", user.email);

        // 2. Pega o ID Token gerado pelo Firebase para este usuário
        const token = await user.getIdToken();
        console.log("Token gerado:", token);

        // 3. Testa a comunicação com o seu backend (rota protegida)
        const response = await fetch("http://localhost:3000/private", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Envia o token no cabeçalho
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Resposta do Backend:", data);
            localStorage.setItem("authToken", token); // Salva token em localstorage
            if (messageEl) {
                messageEl.textContent = "Login efetuado com sucesso! Redirecionando...";
                messageEl.classList.remove("error");
                messageEl.classList.add("success");
            }
            // Pequena espera para que o usuário veja a mensagem antes do redirecionamento
            setTimeout(() => window.location.href = "../pages/dashboard.html", 700);
        } else {
            const text = await response.text();
            console.error("Erro na autorização do backend:", text);
            if (messageEl) {
                messageEl.textContent = `Erro na autorização: ${text}`;
                messageEl.classList.remove("success");
                messageEl.classList.add("error");
            }
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error.code, error.message);
        if (messageEl) {
            const msg = error && error.message ? error.message : 'Erro ao fazer login';
            messageEl.textContent = msg;
            messageEl.classList.remove("success");
            messageEl.classList.add("error");
        }
    }
});