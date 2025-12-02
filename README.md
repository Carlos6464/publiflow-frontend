# PubliFlow - Sistema de Blog Acadêmico (Frontend)

O **PubliFlow** é uma interface gráfica moderna desenvolvida para facilitar a interação acadêmica através de postagens. A aplicação permite que professores gerenciem conteúdos e que alunos consumam informações de forma ágil e intuitiva.

O projeto foi construído com foco em **performance**, **responsividade** e **facilidade de distribuição** através de containers Docker.

---

## 🚀 Tecnologias Utilizadas

Este projeto utiliza as tecnologias mais recentes do ecossistema React e DevOps:

* **Core:** [Next.js 16](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Infraestrutura:** [Docker](https://www.docker.com/) & Docker Compose
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Autenticação:** Context API + [Nookies](https://github.com/maticzav/nookies) (Gerenciamento de Cookies)
* **Feedback Visual:** [Sonner](https://sonner.emilkowal.ski/) (Toasts) e [SweetAlert2](https://sweetalert2.github.io/) (Modais)

---

## 🏗 Arquitetura da Aplicação

A arquitetura segue o modelo modular do **Next.js App Router**:

### 📂 Estrutura de Pastas
* `/app`: Contém todas as rotas (pages), layouts e componentes.
    * `/admin`: Área protegida para professores (Dashboard, CRUD de posts).
    * `/feed`: Feed de notícias para alunos e professores.
    * `/login`: Tela unificada de autenticação e cadastro.
* `/contexts`: Gerenciamento de estado global (Autenticação e Sessão).
* `/service`: Configuração do cliente HTTP (Axios) com suporte a variáveis de ambiente.
* `middleware.ts`: Camada de segurança que intercepta rotas e redireciona usuários não autenticados.

### 🔐 Fluxo de Autenticação
1.  **Middleware:** Protege as rotas `/feed` e `/admin`. Se o token não existir, redireciona para o login. Impede que alunos acessem a área administrativa.
2.  **Contexto (AuthContext):** Persiste o token JWT e o papel do usuário (*role*) em cookies para manter a sessão ativa.
3.  **API Service:** Injeta automaticamente o token Bearer em todas as requisições HTTP feitas ao backend.

---

## ⚙️ Setup e Instalação com Docker

Para rodar esta aplicação, você não precisa instalar Node.js localmente, apenas o Docker.

### Pré-requisitos
* [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.
* Backend da aplicação rodando (acessível via rede).

### 🚀 Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/publiflow-frontend.git](https://github.com/seu-usuario/publiflow-frontend.git)
    cd publiflow-frontend
    ```

2.  **Verifique a Configuração (Docker Compose):**
    O arquivo `docker-compose.yml` já está configurado para conectar ao backend.
    
    * A variável `NEXT_PUBLIC_API_URL` define onde o frontend (navegador e servidor Next.js) deve buscar os dados.
    * **Padrão:** `http://host.docker.internal:3333/api` (Ideal para quando o backend roda na mesma máquina host, fora da rede deste container).

3.  **Subir a Aplicação:**
    Execute o comando para construir a imagem e iniciar o container:
    ```bash
    docker-compose up -d --build
    ```

4.  **Acessar:**
    Abra seu navegador e acesse:
    [http://localhost:3000](http://localhost:3000)

5.  **Parar a Aplicação:**
    Para encerrar a execução e remover o container:
    ```bash
    docker-compose down
    ```

---

## 📖 Guia de Uso

### 1. Login e Cadastro (`/login`)
Acesse a plataforma utilizando o sistema de abas:
* **Sou Aluno:** Acesso ao feed de notícias e perfil.
* **Sou Professor:** Acesso ao painel administrativo.
* **Cadastro:** Clique em "Cadastre-se" para criar uma nova conta. O sistema atribui automaticamente o perfil (Aluno ou Professor) baseado na aba ativa no momento do cadastro.

### 2. Feed de Notícias (`/feed`)
Disponível para todos os usuários logados.
* Visualize os últimos posts com imagens e resumos.
* Utilize a **barra de busca** para filtrar conteúdos em tempo real.
* Navegue entre as páginas de conteúdo através da paginação.

### 3. Painel Administrativo (`/admin`)
*Exclusivo para Professores.*
* **Dashboard:** Visualize e gerencie suas postagens.
* **Status:** Controle a visibilidade dos posts ("Publicado" ou "Rascunho").
* **Criar/Editar:** Editor completo para criação de conteúdo e upload de imagem de capa.
* **Excluir:** Remoção de posts com confirmação de segurança.

### 4. Perfil (`/profile`)
Gerencie seus dados pessoais, como Nome, Email e Telefone.

---

## 🎨 Estilização

O projeto utiliza um **Tema Escuro (Dark Mode)** nativo, configurado via Tailwind CSS.

**Variáveis de CSS (`globals.css`):**
* `brand-primary`: `#F41958` (Rosa Destaque)
* `brand-dark`: `#1E1E1E` (Fundo)
* `brand-surface`: `#333333` (Elementos de Interface)

---

## 🤝 Contribuição

1.  Faça um Fork do projeto.
2.  Crie uma Branch (`git checkout -b feature/NovaFeature`).
3.  Faça o Commit (`git commit -m 'Adiciona Nova Feature'`).
4.  Faça o Push (`git push origin feature/NovaFeature`).
5.  Abra um Pull Request.

---

**Desenvolvido para o Tech Challenge - Full Stack.**
