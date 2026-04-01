# 💮 Ani-Social API

Bem-vindo(a) ao repositório do **Ani-Social**! Esta é uma API moderna construída para um sistema social focado em animes.

## 🚀 Tecnologias

- **Bun** (Runtime e gerenciador de pacotes)
- **ElysiaJS** (Framework web focado em performance)
- **Drizzle ORM** (TypeScript ORM)
- **PostgreSQL** (Banco de dados relacional)
- **Docker & Docker Compose**

## 📋 Pré-requisitos

Para rodar o projeto localmente, certifique-se de que tem as seguintes ferramentas, na máquina:

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) juntamente ao Docker Compose
- Git

Você também precisará criar no diretório principal do projeto um arquivo `.env` contendo as variáveis abaixo (baseadas no nosso `docker-compose.yml`):

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## ⚙️ Instalação e Configuração

### 1. Clonando o Repositório

```bash
git clone https://github.com/OtavioAraujoS/ani-social.git
cd ani-social
```

### 2. Instalando as Dependências

Utilizando o Bun, a instalação é muito rápida:

```bash
bun install
```

### 3. Rodando o Projeto

Você tem duas formas principais de executar as peças da aplicação:

#### 🐳 Opção A: Utilizando Docker em tudo (Recomendado)

Para subir o banco de dados via Docker e junto compilar a aplicação num Container pronto:

```bash
bun run db:up
```

> Este comando irá acionar o Docker Compose rodando o serviço `postgres-db`, irá construir o container `app` e vai rodar as migrações (migrations) do Drizzle em seguida. A API ficará acessível na **porta 3333**.

> Para pausar e abaixar todos os serviços recém subidos no Docker Compose:
>
> ```bash
> bun run db:down
> ```

#### 💻 Opção B: Rodando o App de modo Local

Caso queira maior controle em desenvolvimento local, sem a aplicação inteira rodando no Docker (utilize o Docker apenas para o PostgreSQL no background):

```bash
bun run dev
```

### 🗄️ Comandos Extras (Base de Dados / Drizzle)

O projeto provém alguns atalhos para se operar o banco:

- **Gerar novas migrações:** `bun run db:generate`
- **Rodar migrações pelo Docker:** `bun run db:migrate`
- **Fazer Push no Schema:** `bun run db:push`
- **Abrir Drizzle Studio:** `bun run db:studio`

---

## 🛤️ Arquitetura de Rotas (Controllers)

A aplicação é dividida modularmente com as seguintes rotas base disponíveis. **Nota:** Maior parte dessas rotas requer autenticação, utilizando de JWT (necessário envio de Header `Authorization: Bearer seu-token`).

### 🔐 Autenticação (`/auth`)

| Método | Endpoint      | Descrição                                                              |
| :----- | :------------ | :--------------------------------------------------------------------- |
| `POST` | `/auth/login` | Tenta o login passando `userName` e `password`. Retorna o token `jwt`. |

### ✨ Animes (`/animes`)

| Método   | Endpoint           | Descrição                                                   |
| :------- | :----------------- | :---------------------------------------------------------- |
| `GET`    | `/animes/`         | Lista animes, com suporte a paginação (`?page=1&limit=20`). |
| `GET`    | `/animes/:animeId` | Retorna o detalhamento de um anime específico pelo ID.      |
| `POST`   | `/animes/`         | Realiza o cadastro estruturado de um novo anime.            |
| `PATCH`  | `/animes/`         | Atualiza atributos base de um anime.                        |
| `PATCH`  | `/animes/image`    | Atualiza capas e imagens do anime (ex: via Cloudinary).     |
| `DELETE` | `/animes/:animeId` | Exclui por completo os registros daquele anime.             |

### 🏷️ Tópicos (`/topics`)

| Método   | Endpoint           | Descrição                                                      |
| :------- | :----------------- | :------------------------------------------------------------- |
| `GET`    | `/topics/`         | Retorna todos os tópicos de debates de anime paginados.        |
| `GET`    | `/topics/:topicId` | Consome a descrição detalhada de um tópico.                    |
| `POST`   | `/topics/`         | Criação de um novo tópico para conversas.                      |
| `PATCH`  | `/topics/:topicId` | Edita o conteúdo de um tópico existente informando a Topic ID. |
| `DELETE` | `/topics/:topicId` | Deleta inteiramente aquele registro.                           |

### 💬 Comentários (`/comments`)

| Método   | Endpoint             | Descrição                                               |
| :------- | :------------------- | :------------------------------------------------------ |
| `GET`    | `/comments/:topicId` | Traz os comentários vinculados a seu respectivo tópico. |
| `POST`   | `/comments/`         | Usuário insere seus comentários no tópico.              |
| `PATCH`  | `/comments/`         | Edição do próprio comentário.                           |
| `DELETE` | `/comments/`         | O usuário dono exclui seu comentário.                   |

### 🧑‍💻 Usuários (`/users`)

| Método   | Endpoint          | Descrição                                                                    |
| :------- | :---------------- | :--------------------------------------------------------------------------- |
| `POST`   | `/users/`         | Rota livre/pública onde os novatos se registram à rede pela 1ª vez.          |
| `GET`    | `/users/:userId`  | Consulta os dados de um outro companheiro na rede.                           |
| `PATCH`  | `/users/`         | Atualiza dados corriqueiros do perfil do usuário em escopo de logado.        |
| `PATCH`  | `/users/password` | Redefine exclusivamente a senha da sua conta.                                |
| `PATCH`  | `/users/avatar`   | Refaz os campos do avatar (imagem do perfil).                                |
| `GET`    | `/users/admin/`   | Lista em massa usuários cadatrados de acordo com paginação. _(Apenas Admin)_ |
| `DELETE` | `/users/admin/`   | Deleta do sistema usuários inteiros sob regência. _(Apenas Admin)_           |
