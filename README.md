# webhookhub

Projeto de plataforma que conecta sistemas via webhook.

**Este README descreve tudo que uma pessoa precisa fazer e ter para rodar este projeto localmente, incluindo como proteger chaves sensíveis (Firebase).**

**Pré-requisitos**
- Node.js (v18+ recomendado)
- npm ou yarn
- Conta no Firebase / Google Cloud (para criar projeto, ativar Auth e criar service account)

**Estrutura importante**
- `src/` - backend em TypeScript (Express)
- `src/config/serviceAccountKey.json` - chave administrativa do Firebase (NÃO comitar)
- `frontend/` - arquivos públicos do frontend
	- `frontend/js/firebase.example.js` - exemplo de configuração do Firebase (versão com placeholders)
	- `frontend/js/firebase.local.js` - configuração local (NÃO comitar)

1) Clonar o repositório

```bash
git clone <repo-url>
cd webhookhub
```

2) Instalar dependências

```bash
npm install
# ou: yarn
```

3) Configurar Firebase (backend)

- No console do Google Cloud / Firebase, crie um projeto e gere uma chave de conta de serviço (Service Account) com permissões de Admin (ou apenas as permissões necessárias para o Firestore/Auth).
- Baixe o JSON gerado e salve em `src/config/serviceAccountKey.json`.
- Este arquivo está listado no `.gitignore` por padrão — NÃO o comite.

Se por algum motivo já foi commitado, remova do índice com:

```bash
git rm --cached src/config/serviceAccountKey.json
git commit -m "remove serviceAccountKey from repo"
git push
```

Se a chave já foi exposta publicamente, gere uma nova chave no console do Google Cloud e delete a anterior (rotacionar credenciais).

4) Configurar Firebase (frontend)

- Copie o arquivo de exemplo para o arquivo local (que está no `.gitignore`):

```bash
cp frontend/js/firebase.example.js frontend/js/firebase.local.js
# no Windows PowerShell:
# Copy-Item frontend/js/firebase.example.js frontend/js/firebase.local.js
```

- Abra `frontend/js/firebase.local.js` e preencha os valores com a configuração do seu projeto Firebase (estas chaves são públicas por design — ainda assim mantenha fora do repositório para organização):

```js
export const firebaseConfig = {
	apiKey: "SUA_API_KEY",
	authDomain: "SEU_PROJETO.firebaseapp.com",
	projectId: "SEU_PROJETO_ID",
	storageBucket: "SEU_PROJETO.appspot.com",
	messagingSenderId: "SUA_MESSAGING_SENDER_ID",
	appId: "SUA_APP_ID",
	measurementId: "SEU_MEASUREMENT_ID",
};
```

Observação: a `apiKey` do Firebase para Web é pública por design — a real proteção é nas regras do Firebase e na conta de serviço do backend.

5) Rodar o servidor em modo desenvolvimento

```bash
npm run dev
# o servidor inicia na porta 3000 por padrão
```

6) Testar o frontend

- Abra `http://localhost:3000` se você configurou o Express para servir os arquivos estáticos. (Se não, abra `frontend/index.html` diretamente no navegador durante testes locais — entretanto, chamadas API protegidas por CORS podem exigir que o frontend seja servido pelo Express.)
- Use o formulário de login para autenticar via Firebase Authentication. Depois de logado, o frontend obtém um `idToken` e o armazena em `localStorage` (assim o backend pode validar o token nas rotas protegidas).

7) Testar rotas protegidas (exemplo com curl)

- Faça login pelo frontend ou obtenha um `idToken` usando a REST API do Firebase (endpoint `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]`). Exemplo para obter `idToken`:

```bash
curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY" \
	-H "Content-Type: application/json" \
	-d '{"email":"user@example.com","password":"senha","returnSecureToken":true}'
```

O JSON retornado terá `idToken` — então chame a rota privada:

```bash
curl -H "Authorization: Bearer <ID_TOKEN>" http://localhost:3000/private
```

8) Prevenção de vazamento de segredos e limpeza do histórico Git

- Certifique-se de que `src/config/serviceAccountKey.json` e `frontend/js/firebase.local.js` NÃO estejam sendo rastreados por Git. Verifique com:

```bash
git ls-files | grep "serviceAccountKey.json\|firebase.local.js" || echo "nenhum arquivo sensível rastreado"
```

- Se um arquivo sensível já foi comitado, remova com `git rm --cached <arquivo>` e faça um novo commit.
- Para remover do histórico permanentemente (quando já foi publicado), use `bfg` ou `git-filter-repo` e force push. Tenha cuidado: reescrever histórico exige que todos os colaboradores reclonem o repositório.

9) Segurança e boas práticas

- Não comite chaves administrativas do Google Cloud / Firebase.
- Restrinja permissões das chaves e rotacione credenciais quando necessário.
- Use regras do Firebase (Firestore/Storage) para restringir acesso e valide tokens no backend (o middleware `authMiddleware` já faz validação de `idToken` com o `firebase-admin`).

10) Como rodar em produção

- Compile TypeScript:

```bash
npm run build
```

- Inicie o servidor compilado:

```bash
npm start
```

11) Troubleshooting rápido

- Erro: `token nao enviado` — verifique se a chamada à API inclui o header `Authorization: Bearer <idToken>`.
- Erro: `token invalido` — verifique se o token expirou ou se você está usando o projeto Firebase correto.
- Erro ao inicializar admin SDK — confirme que `src/config/serviceAccountKey.json` existe e tem as credenciais corretas.


