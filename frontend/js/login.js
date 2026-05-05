import { auth } from "./config/firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (event) => {
    // Evita que a página recarregue ao enviar o formulário
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

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
            alert("Login e autenticação no backend com sucesso!");
            
            // Aqui você pode redirecionar o usuário para a página principal (Dashboard)
            // window.location.href = "/dashboard.html";
        } else {
            console.error("Erro na autorização do backend:", await response.text());
        }

    } catch (error) {
        console.error("Erro ao fazer login:", error.code, error.message);
        alert("Falha no login. Verifique seu e-mail e senha.");
    }
});