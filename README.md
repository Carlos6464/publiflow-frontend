# PubliFlow - Sistema de Blog Acadêmico

O **PubliFlow** é uma aplicação front-end desenvolvida para facilitar a interação acadêmica através de postagens, permitindo que professores gerenciem conteúdos e alunos consumam informações de forma ágil e intuitiva.

A aplicação foi construída com foco em performance, responsividade e uma experiência de usuário moderna.

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as tecnologias mais recentes do ecossistema React:

* **Core:** [Next.js 16](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Requisições HTTP:** [Axios](https://axios-http.com/)
* **Autenticação:** Context API + [Nookies](https://github.com/maticzav/nookies) (Gerenciamento de Cookies)
* **Feedback Visual:** [Sonner](https://sonner.emilkowal.ski/) (Toasts) e [SweetAlert2](https://sweetalert2.github.io/) (Modais)

---

## 🏗 Arquitetura da Aplicação

O projeto segue a arquitetura moderna do **Next.js App Router**, organizando rotas e lógicas de forma modular.

### Estrutura de Pastas Principal
* `/app`: Contém todas as rotas (pages), layouts e componentes globais.
    * `/admin`: Rotas protegidas exclusivas para professores (Dashboard, CRUD de posts).
    * `/feed`: Rota principal de visualização de conteúdo para alunos e professores.
    * `/login`: Tela única para autenticação e cadastro.
* `/contexts`: Gerenciamento de estado global (Autenticação).
* `/service`: Configuração do cliente HTTP (Axios).
* `/middleware.ts`: Controle de segurança e redirecionamento de rotas no servidor.

### Fluxo de Autenticação e Segurança
1.  **Middleware (`middleware.ts`):** Intercepta as requisições. Se um usuário não autenticado tentar acessar `/feed` ou `/admin`, ele é redirecionado para o login. Se um aluno tentar acessar a área `/admin`, é redirecionado para o feed.
2.  **Contexto (`AuthContext.tsx`):** Gerencia o estado do usuário, login e logout, persistindo o token JWT e o papel do usuário (role) em cookies para manter a sessão ativa.
3.  **API Service:** O Axios intercepta as requisições e injeta automaticamente o token Bearer nos cabeçalhos.

---

## ⚙️ Setup Inicial e Instalação

### Pré-requisitos
* Node.js (versão 18 ou superior recomendada)
* Backend da aplicação rodando (Padrão: `http://localhost:3333`)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/publiflow-frontend.git](https://github.com/seu-usuario/publiflow-frontend.git)
    cd publiflow-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração da API:**
    Verifique o arquivo `service/api.ts`. Por padrão, ele aponta para o localhost. Se necessário, ajuste a `baseURL`:
    ```typescript
    export const api = axios.create({
      baseURL: 'http://localhost:3333/api',
    });
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

5.  **Acesse:**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📖 Guia de Uso Detalhado

### 1. Login e Cadastro (`/login`)
A tela inicial permite o acesso de dois tipos de usuários. Utilize as abas superiores para alternar:
* **Sou Aluno:** Acesso para visualizar o feed e editar perfil.
* **Sou Professor:** Acesso administrativo para criar, editar e excluir postagens.
* *Cadastro:* Clique em "Cadastre-se" para criar uma nova conta. O sistema detecta automaticamente o tipo de usuário com base na aba selecionada.

### 2. Feed de Notícias (`/feed`)
Disponível para todos os usuários autenticados.
* **Visualização:** Lista de cards com imagem, título, data e resumo.
* **Busca:** Barra de pesquisa em tempo real (Debounced) para filtrar postagens.
* **Paginação:** Navegação entre páginas de conteúdo.
* **Menu de Usuário:** No canto superior direito, acesso rápido ao Perfil e Logout.

### 3. Painel Administrativo (`/admin`)
*Exclusivo para Professores.*
* **Dashboard:** Visão geral das postagens criadas pelo professor logado.
* **Status:** Indica visualmente se o post é "Publicado" (Verde) ou "Rascunho" (Amarelo).
* **Ações:**
    * **Criar:** Botão "Nova Postagem".
    * **Editar:** Ícone de lápis para alterar conteúdo e imagem.
    * **Excluir:** Ícone de lixeira (com confirmação via SweetAlert2).

### 4. Gerenciamento de Postagem (`/admin/post/...`)
* **Formulário:** Criação e edição de posts.
* **Upload:** Suporte para upload de imagem de capa com pré-visualização.
* **Visibilidade:** Toggle para definir se o post aparece ou não no feed dos alunos.

### 5. Perfil (`/profile`)
Permite a atualização de dados cadastrais como Nome, Email e Telefone.

---

## 🎨 Design System e Estilização

O projeto utiliza um tema escuro (Dark Mode) nativo configurado via Tailwind CSS.

* **Paleta de Cores (definida em `globals.css`):**
    * `brand-primary`: #F41958 (Rosa destaque)
    * `brand-dark`: #1E1E1E (Fundo principal)
    * `brand-surface`: #333333 (Cards e modais)
* **Responsividade:** Layout totalmente adaptável para Mobile, Tablet e Desktop.

---

## 🤝 Contribuição

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o Commit (`git commit -m 'Adicionando nova feature'`).
4.  Faça o Push (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

---

**Desenvolvido para o Tech Challenge - Full Stack.**
