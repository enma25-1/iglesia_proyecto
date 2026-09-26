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

## Backup y restauración de MongoDB

Requiere que el contenedor `mongodb` esté corriendo (`docker compose up -d mongodb` desde `iglesia-backend/`).

```bash
# Backup: genera iglesia-backend/dump/iglesia-<fecha>.archive.gz
npm run db:backup --workspace iglesia-backend

# Restaurar el backup más reciente en dump/
npm run db:restore --workspace iglesia-backend

# Restaurar un archivo específico
npm run db:restore --workspace iglesia-backend -- iglesia-2026-01-01T12-00-00-000Z.archive.gz
```

> `db:restore` usa `--drop`: reemplaza las colecciones de destino que también estén en el backup. Pensado para restaurar sobre una instancia nueva/vacía (ej. al migrar de PC), no para fusionar datos con una base ya en uso.

Los archivos de `dump/` no se versionan en git (igual que `data/` y `uploads/`); transfiérelos a mano entre PCs por un medio seguro (USB, etc.), nunca por chat/correo si contienen datos de personas.

### Verificar un backup sin arriesgar los datos reales

`db:restore` usa `--drop`, así que antes de restaurar sobre una base con datos reales conviene probar el backup en un Mongo desechable aparte:

```bash
# Crea un Mongo temporal en otro puerto/contenedor
docker run -d --name mongodb-test -p 27018:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo:7

# Restaura el backup ahí en vez del contenedor "mongodb" real
MONGO_CONTAINER=mongodb-test npm run db:restore --workspace iglesia-backend

# Revisa que los datos estén completos y, al terminar, elimina el contenedor de prueba
docker rm -f mongodb-test
```

Este flujo (backup → restore en un Mongo desechable) ya se validó: 9 colecciones y 363 documentos restaurados sin fallos, incluyendo los índices únicos (`name_1`, `username_1`, etc.), sin tocar la base de desarrollo real.

## Migrar el sistema a otra PC

1. **Instala requisitos** en la PC destino: Node 20+, npm 7+, Docker y Docker Compose.
2. **Clona el repo** y corre `npm install` desde la raíz.
3. **Recrea los `.env`** (no viajan con git):
   - `iglesia-backend/.env` — ver [Variables de entorno](#variables-de-entorno).
   - `iglesia-frontend/.env` — copia `iglesia-frontend/.env.template` y ajusta `VITE_API_URL` / `VITE_cloudUlr`.
   - Transfiere los valores reales (usuario/clave de Mongo, `SECRET_JWT_SEED`, credenciales de Cloudinary) por un canal seguro.
4. **Levanta MongoDB** en la PC destino: `docker compose up -d mongodb` (desde `iglesia-backend/`).
5. **Copia el backup** (`npm run db:backup` en la PC de origen) y el backup resultante en `iglesia-backend/dump/` a la PC destino, en la misma ruta.
6. **Restaura**: `npm run db:restore --workspace iglesia-backend` en la PC destino.
7. **Copia `iglesia-backend/uploads/`** completa de la PC de origen a la misma ruta en la PC destino (fotos y otros archivos subidos por usuarios; no viaja con git ni con el backup de Mongo).
8. Levanta el resto (`docker compose up --build` o backend/frontend en local, según la opción elegida) y verifica que los datos y archivos aparecen correctamente.

## Notas

- No se versionan `.env`, `node_modules/`, `dist/`, logs ni los datos de MongoDB (`data/`, `dump/`, `uploads/`).
- El primer commit del monorepo es manual: `git add . && git commit -m "chore: init monorepo"`.
