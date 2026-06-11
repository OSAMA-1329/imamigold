# ImamiHub Backend

Monolithic Node.js backend for the ImamiHub Gold Retail Management System.

## Stack
- **Runtime:** Node.js 18+ (ESM)
- **Framework:** Express 4
- **DB:** MongoDB (Mongoose)
- **Realtime:** Socket.IO
- **Auth:** JWT (Bearer)
- **Validation:** Zod
- **Uploads:** Multer (local disk; swap to S3 later)

## Architecture

Single deployable process. Feature-sliced under `src/modules/<feature>/` with
`*.model.js`, `*.controller.js`, `*.routes.js`, `*.service.js` per module.

```
src/
  config/        env + db
  middleware/    auth, error handler, role guard, uploads
  modules/
    auth/        sign-up, sign-in, /me
    users/       directory + role lookup
    leads/       Gold retail lead CRUD + assignment
    chats/       direct + group messages
    groups/      group create/list/membership
    notifications/
    uploads/     file upload endpoint (lead images, avatars)
  realtime/      Socket.IO handlers (chat events)
  utils/         helpers, seed
  app.js         Express app wiring
  server.js      HTTP + Socket.IO bootstrap
```

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # optional: seed demo users
npm run dev
```

Server runs on `http://localhost:4000`.

## Wire to the frontend

In the React app's `.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Auth

All routes under `/api` (except `/api/auth/*` and `/api/health`) require:

```
Authorization: Bearer <jwt>
```

Roles: `admin`, `purchase`, `wholesale`, `retail`. Admin bypasses role checks.

## REST surface (high level)

| Method | Path                          | Role            |
| ------ | ----------------------------- | --------------- |
| POST   | /api/auth/signup              | public          |
| POST   | /api/auth/signin              | public          |
| GET    | /api/auth/me                  | any             |
| GET    | /api/users                    | any             |
| GET    | /api/leads                    | any (scoped)    |
| POST   | /api/leads                    | admin           |
| PATCH  | /api/leads/:id                | admin           |
| DELETE | /api/leads/:id                | admin           |
| GET    | /api/chats                    | any (scoped)    |
| POST   | /api/chats/:id/messages       | any (member)    |
| DELETE | /api/chats/:id/messages/:mid  | sender/admin    |
| GET    | /api/groups                   | any             |
| POST   | /api/groups                   | admin           |
| GET    | /api/notifications            | any             |
| POST   | /api/uploads                  | any (multipart) |

## Socket.IO events

Mirror `src/lib/socket.js` in the frontend:

- client -> server: `chat:join`, `chat:leave`, `message:send`,
  `message:delete`, `chat:delete`, `chat:typing`, `message:read`
- server -> client: `message:new`, `message:deleted`, `message:status`,
  `chat:deleted`, `presence:update`, `chat:typing:update`
