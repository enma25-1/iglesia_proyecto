# Iglesia Monorepo

Monorepo con el **backend** (Node.js + Express + Mongoose + Socket.IO) y el **frontend** (React + TypeScript + Vite + Electron) del sistema de iglesia.

## Estructura

```
.
├── package.json            # Raíz del monorepo (npm workspaces)
├── .gitignore
├── iglesia-backend/        # API REST + WebSockets (Express, MongoDB)
└── iglesia-frontend/       # SPA (Vite) + app de escritorio (Electron)
```

## Requisitos

- **Node.js** 20 o superior y **npm** 7+ (por los workspaces).
- **Docker** y **Docker Compose** (opcional, recomendado para MongoDB/backend).
- **MongoDB** local si prefieres ejecutar sin Docker.

## Instalación

Desde la raíz del monorepo, instala todas las dependencias de ambos workspaces de una sola vez:

```bash
npm install
```

## Variables de entorno

### Backend — `iglesia-backend/.env`

```env
PORT=4000
DB_URL=mongodb://admin:admin123@mongodb:27017/iglesia?authSource=admin
SECRET_JWT_SEED=cambia_esta_clave
```

> El host es `mongodb`, el nombre del servicio en `docker-compose.yml` (no `localhost`), porque el backend también corre dentro de Docker y se conecta a Mongo por la red interna del compose (Opción A, ver abajo). Solo si corres el backend fuera de Docker (Opción B) el host debe ser `localhost`: `mongodb://admin:admin123@localhost:27017/iglesia?authSource=admin`.

### Frontend — `iglesia-frontend/.env`

Copia la plantilla y ajusta los valores:

```bash
cp iglesia-frontend/.env.template iglesia-frontend/.env
```

```env
VITE_API_URL=http://localhost:4000/
VITE_cloudUlr="YourCloudinaryUrl"
```

## Ejecución

### Opción A — Docker Compose (backend + MongoDB)

Levanta MongoDB y el backend juntos:

```bash
cd iglesia-backend
docker compose up --build
```

- API en `http://localhost:4000`.
- MongoDB con usuario `admin` / `admin123`.

Luego corre el frontend en local (ver abajo).

### Opción B — Todo en local

1. Levanta MongoDB (por ejemplo con Docker):

   ```bash
   cd iglesia-backend
   docker compose up -d mongodb
   ```

   Asegúrate de que `DB_URL` en `.env` apunte a `localhost`.

2. Backend en modo desarrollo (nodemon + babel):

   ```bash
   npm run dev:backend
   ```

3. Frontend en modo desarrollo (Vite):

   ```bash
   npm run dev:frontend
   ```

### Frontend de escritorio (Electron)

```bash
npm run dev:electron --workspace iglesia
```

Los instaladores de escritorio se generan y publican automáticamente en cada merge a `main` (workflow `Electron Desktop Build`):

- **Windows** (`.exe`, sirve para Windows 10 y 11)
- **Linux** (`.AppImage`)

Descárgalos siempre actualizados desde:

**[Releases → desktop-latest](https://github.com/enma25-1/iglesia_proyecto/releases/tag/desktop-latest)**

## Scripts de la raíz

| Script                  | Descripción                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev:backend`   | Backend en modo desarrollo (nodemon)           |
| `npm run dev:frontend`  | Frontend con Vite (hot reload)                 |
| `npm run build:backend` | Compila el backend con Babel a `dist/`         |
| `npm run build:frontend`| Compila el frontend (`tsc` + Vite) a `dist/`   |

También puedes ejecutar cualquier script de un workspace directamente:

```bash
npm run <script> --workspace iglesia-backend
npm run <script> --workspace iglesia
```

### Scripts del backend

| Script  | Descripción                              |
| ------- | ---------------------------------------- |
| `dev`   | nodemon + babel-node sobre `src/index.js`|
| `build` | Compila `src/` a `dist/`                 |
| `start` | Ejecuta `dist/index.js` (producción)     |

### Scripts del frontend

| Script           | Descripción                              |
| ---------------- | ---------------------------------------- |
| `dev`            | Servidor de desarrollo Vite              |
| `build`          | `tsc` + build de producción Vite         |
| `build:electron` | Empaqueta la app de escritorio           |
| `lint`           | ESLint sobre `.ts` / `.tsx`              |
| `preview`        | Previsualiza el build de producción      |

## Notas

- No se versionan `.env`, `node_modules/`, `dist/`, logs ni los datos de MongoDB (`data/`, `dump/`, `uploads/`).
- El primer commit del monorepo es manual: `git add . && git commit -m "chore: init monorepo"`.
