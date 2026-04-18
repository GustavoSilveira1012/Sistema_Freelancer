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

## Status do Projeto

MVP funcional em evolucao.

Proximos passos planejados:
- melhorar observabilidade (logs estruturados e tratamento de erros)
- ampliar testes automatizados
- adicionar filtros e metricas avancadas no dashboard
- melhorar responsividade e experiencia mobile

## Autor

Desenvolvido por Gustavo.

Se quiser, eu tambem posso adaptar este README para versao bilingue (PT-BR + EN) focada em recrutadores internacionais.
