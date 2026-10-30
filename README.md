# FreelaFlow

Sistema full stack para gestão de freelancers: autenticação, controle de clientes, projetos e tarefas, com dashboard de acompanhamento.

## Visao Geral

O FreelaFlow foi desenvolvido como MVP para centralizar o fluxo operacional de um freelancer em um unico lugar:
- cadastro e login seguros com JWT
- organizacao de clientes
- acompanhamento de projetos por status e pagamento
- controle de tarefas por prioridade e progresso
- painel com metricas iniciais de receita e produtividade

## Stack Tecnologica

### Backend
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT (jsonwebtoken) + bcryptjs
- Helmet + CORS

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS v4
- Axios
- Recharts
- jsPDF

## Arquitetura

Projeto organizado em duas aplicacoes:
- `backend/`: API REST e regras de negocio
- `frontend/`: interface web e fluxo de autenticacao

No backend, o padrao principal e em camadas:
- controllers: recebem requisicoes HTTP
- services: aplicam regras de negocio
- repositories: acesso a dados via Prisma

## Funcionalidades

- Autenticacao
- Registro de usuario
- Login com JWT
- Recuperacao de sessao atual (`/auth/me`)

- Clientes
- Criar, listar, editar e excluir clientes

- Projetos
- Criar, listar, editar e excluir projetos
- Filtros por cliente, status e pagamento
- Exportacao de relatorio em PDF

- Tarefas
- Criar, listar, editar e excluir tarefas
- Filtros por projeto, status e prioridade

- Dashboard
- Indicadores iniciais de projetos e receita
- Grafico de ganhos mensais

## Modelo de Dados

Entidades principais no banco:
- User
- Client
- Project
- Task

Relacionamentos:
- 1 usuario possui varios clientes
- 1 cliente possui varios projetos
- 1 projeto possui varias tarefas

## Endpoints Principais

Base URL local da API:
- `http://localhost:3001`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Clientes:
- `GET /clients`
- `POST /clients`
- `PUT /clients/:id`
- `DELETE /clients/:id`

Projetos:
- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

Tarefas:
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Como Rodar o Projeto

### 1) Pre-requisitos

- Node.js 20+
- npm 10+
- Docker (opcional, recomendado para subir o PostgreSQL)

### 2) Clonar o repositorio

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Sistema_Freelancer
```

### 3) Subir banco de dados (opcional com Docker)

```bash
cd backend
docker compose up -d
```

### 4) Configurar variaveis de ambiente do backend

Crie o arquivo `backend/.env`:

```env
DATABASE_URL="postgresql://freela:freela123@localhost:5432/freelaflow?schema=public"
JWT_SECRET="sua_chave_super_secreta"
PORT=3001
```

### 5) Instalar dependencias

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

### 6) Preparar banco com Prisma

```bash
cd ../backend
npm run prisma:generate
npm run prisma:push
```

### 7) Rodar em desenvolvimento

Backend (terminal 1):
```bash
cd backend
npm run dev
```

Frontend (terminal 2):
```bash
cd frontend
npm run dev
```

Aplicacao web:
- `http://localhost:5173`

## Scripts Uteis

Backend:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run prisma:migrate`
- `npm run prisma:studio`

Frontend:
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Deploy público (Vercel + Render)

### Backend no Render

Configure o serviço web com a pasta raiz `backend`, o comando de build `npm run build` e o comando de início `npm start`. O início aplica as migrações do Prisma com até seis tentativas e espera crescente para absorver indisponibilidades temporárias do banco.

Em Environment Variables, configure:

- `DATABASE_URL`: copie a **Internal Database URL** no painel do PostgreSQL do Render. O serviço web e o banco precisam estar na mesma conta e região. Confirme também que o banco está disponível e dentro do prazo do plano.
- `FRONTEND_URL`: use a origem exata publicada pela Vercel, por exemplo `https://sistema-freelancer-taupe.vercel.app`. Origens adicionais podem ser separadas por vírgula.
- `JWT_SECRET`: defina um valor aleatório, único e forte. Não o coloque no GitHub.
- `PORT`: o Render fornece essa variável automaticamente.

Se o serviço registrar `P1001` durante as migrações, o banco não está alcançável pelo serviço. Confirme o estado do banco, recopie a URL interna e valide a região da API e do banco. As tentativas automáticas não corrigem banco expirado, URL antiga ou região incompatível.

### Frontend na Vercel

Importe o repositório na raiz para usar o `vercel.json` existente e configure `VITE_API_URL` com a URL pública base do backend no Render, sem `/auth/register` e sem barra final. Essa variável é incluída no build do Vite; faça um novo deploy depois de alterá-la.

Depois do deploy, `GET <URL_DO_BACKEND>/health` deve retornar `{ status: "ok" }`. O cadastro depende também de o backend alcançar o PostgreSQL e aceitar a origem em `FRONTEND_URL`.

### Limites do plano gratuito

Serviços web gratuitos do Render podem entrar em repouso após 15 minutos sem tráfego e levar cerca de um minuto para iniciar novamente. Bancos PostgreSQL gratuitos têm outro limite: expiram após 30 dias e ficam inacessíveis até upgrade; após o período de carência de 14 dias, são apagados. Para uma demonstração pública duradoura, mantenha banco e API em planos que não expirem.

Veja a documentação atual do [Render Postgres](https://render.com/docs/postgresql-creating-connecting) e dos [planos gratuitos do Render](https://render.com/docs/free).

Não versione arquivos `.env` com valores reais. Se uma credencial já foi commitada, troque-a no serviço correspondente; apagar o arquivo em um commit novo não remove cópias do histórico do Git.

## Status do Projeto

MVP funcional em evolucao.

Proximos passos planejados:
- melhorar observabilidade (logs estruturados e tratamento de erros)
- ampliar testes automatizados
- adicionar filtros e metricas avancadas no dashboard
- melhorar responsividade e experiencia mobile

## Autor

Desenvolvido por Gustavo.
