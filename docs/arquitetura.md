# System_Freelancer Architecture

This document explains the layered architecture used in the project.

---

## PT-BR

### Visao Geral

O repositorio e dividido em duas aplicacoes:
- `backend/`: API REST, regras de negocio e acesso a dados
- `frontend/`: interface web, roteamento e consumo da API

A ideia principal e separar responsabilidades para facilitar manutencao, testes e evolucao.

### Backend (Node.js + Express + Prisma)

#### 1. Controllers
- Local: `backend/src/controllers`
- Responsabilidade:
- receber requisicoes HTTP
- chamar o service correto
- devolver resposta HTTP apropriada
- tratar erros de entrada/fluxo de forma padronizada

Controllers nao devem conter regra de negocio complexa.

#### 2. Services
- Local: `backend/src/services`
- Responsabilidade:
- implementar regras de negocio
- validar fluxos de autorizacao
- combinar dados de diferentes repositories

Services funcionam como a camada de dominio da aplicacao.

#### 3. Repositories
- Local: `backend/src/repositories`
- Responsabilidade:
- encapsular acesso ao banco via Prisma
- centralizar operacoes de leitura/escrita

Repositories isolam detalhes de persistencia do restante do sistema.

#### 4. Routes
- Local: `backend/src/routes`
- Responsabilidade:
- mapear rotas HTTP para controllers
- aplicar middlewares (ex.: autenticacao)

#### 5. Middlewares
- Local: `backend/src/middlewares`
- Responsabilidade:
- autenticacao JWT
- tratamento global de erros

#### 6. Prisma / Banco
- Schema: `backend/prisma/schema.prisma`
- Entidades principais:
- `User`
- `Client`
- `Project`
- `Task`
- `ActivityLog`

Relacoes principais:
- `User` 1:N `Client`
- `Client` 1:N `Project`
- `Project` 1:N `Task`
- `User` 1:N `ActivityLog`

### Frontend (React + Vite + Tailwind)

#### 1. Pages
- Local: `frontend/src/pages`
- Responsabilidade:
- compor telas
- orquestrar estados de tela
- chamar servicos de API

#### 2. Components
- Local: `frontend/src/components`
- Responsabilidade:
- componentes reutilizaveis de interface (ex.: Sidebar, Modal, ProtectedRoute)

#### 3. Context
- Local: `frontend/src/context`
- Responsabilidade:
- estado global de autenticacao (`AuthContext`)
- login/logout e validacao de sessao

#### 4. Services
- Local: `frontend/src/services`
- Responsabilidade:
- cliente HTTP (Axios)
- configuracao de `baseURL`
- injeccao automatica do token JWT

#### 5. Hooks
- Local: `frontend/src/hooks`
- Responsabilidade:
- logicas reutilizaveis (ex.: busca/filtro)

### Fluxo de Requisicao (Resumo)

1. Usuario interage com uma pagina no frontend.
2. A pagina chama `api.ts` para requisitar dados.
3. O backend recebe a rota e direciona para o controller.
4. O controller chama o service.
5. O service aplica regras e usa repositories.
6. O repository acessa o banco via Prisma.
7. A resposta retorna ate o frontend.

### Beneficios da Estrutura

- baixo acoplamento entre camadas
- maior legibilidade do codigo
- facilidade para adicionar novas features
- melhor base para testes unitarios e de integracao
- padrao escalavel para projetos reais de producao

---

## EN

### Overview

The repository is split into two applications:
- `backend/`: REST API, business rules, and data access
- `frontend/`: web UI, routing, and API consumption

The main goal is to separate responsibilities to improve maintainability, testing, and evolution.

### Backend (Node.js + Express + Prisma)

#### 1. Controllers
- Location: `backend/src/controllers`
- Responsibilities:
- receive HTTP requests
- call the correct service
- return the proper HTTP response
- handle input/flow errors consistently

Controllers should not contain complex business logic.

#### 2. Services
- Location: `backend/src/services`
- Responsibilities:
- implement business rules
- validate authorization flows
- combine data from different repositories

Services act as the domain layer of the application.

#### 3. Repositories
- Location: `backend/src/repositories`
- Responsibilities:
- encapsulate database access through Prisma
- centralize read/write operations

Repositories isolate persistence details from the rest of the system.

#### 4. Routes
- Location: `backend/src/routes`
- Responsibilities:
- map HTTP routes to controllers
- apply middlewares (e.g., authentication)

#### 5. Middlewares
- Location: `backend/src/middlewares`
- Responsibilities:
- JWT authentication
- global error handling

#### 6. Prisma / Database
- Schema: `backend/prisma/schema.prisma`
- Main entities:
- `User`
- `Client`
- `Project`
- `Task`
- `ActivityLog`

Main relationships:
- `User` 1:N `Client`
- `Client` 1:N `Project`
- `Project` 1:N `Task`
- `User` 1:N `ActivityLog`

### Frontend (React + Vite + Tailwind)

#### 1. Pages
- Location: `frontend/src/pages`
- Responsibilities:
- compose screens
- orchestrate UI state
- call API services

#### 2. Components
- Location: `frontend/src/components`
- Responsibilities:
- reusable UI components (e.g., Sidebar, Modal, ProtectedRoute)

#### 3. Context
- Location: `frontend/src/context`
- Responsibilities:
- global authentication state (`AuthContext`)
- login/logout and session validation

#### 4. Services
- Location: `frontend/src/services`
- Responsibilities:
- HTTP client (Axios)
- `baseURL` configuration
- automatic JWT token injection

#### 5. Hooks
- Location: `frontend/src/hooks`
- Responsibilities:
- reusable logic (e.g., search/filter)

### Request Flow (Summary)

1. The user interacts with a frontend page.
2. The page calls `api.ts` to request data.
3. The backend receives the route and forwards it to a controller.
4. The controller calls a service.
5. The service applies business rules and uses repositories.
6. The repository accesses the database via Prisma.
7. The response is returned to the frontend.

### Architecture Benefits

- low coupling between layers
- better code readability
- easier feature evolution
- better foundation for unit and integration testing
- scalable pattern for real production projects
