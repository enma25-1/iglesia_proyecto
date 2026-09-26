#!/usr/bin/env node
/**
 * Genera un backup de la base de datos MongoDB del contenedor Docker
 * definido en docker-compose.yml, usando mongodump.
 *
 * Uso: node scripts/backup-db.js
 *      npm run db:backup --workspace iglesia-backend
 *
 * Variables de entorno opcionales (por defecto usan los valores de
 * docker-compose.yml): MONGO_ROOT_USER, MONGO_ROOT_PASSWORD, MONGO_DB,
 * MONGO_CONTAINER.
 */
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const MONGO_USER = process.env.MONGO_ROOT_USER || "admin";
const MONGO_PASSWORD = process.env.MONGO_ROOT_PASSWORD || "admin123";
const MONGO_DB = process.env.MONGO_DB || "iglesia";
const CONTAINER = process.env.MONGO_CONTAINER || "mongodb";

const dumpDir = path.join(__dirname, "..", "dump");
fs.mkdirSync(dumpDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const fileName = `iglesia-${timestamp}.archive.gz`;
const containerPath = `/tmp/${fileName}`;
const hostPath = path.join(dumpDir, fileName);

try {
  console.log(
    `Generando backup de la base "${MONGO_DB}" desde el contenedor "${CONTAINER}"...`,
  );

  execSync(
    `docker exec ${CONTAINER} mongodump --username ${MONGO_USER} --password ${MONGO_PASSWORD} --authenticationDatabase admin --db ${MONGO_DB} --archive=${containerPath} --gzip`,
    { stdio: "inherit" },
  );

  execSync(`docker cp ${CONTAINER}:${containerPath} "${hostPath}"`, {
    stdio: "inherit",
  });

  execSync(`docker exec ${CONTAINER} rm ${containerPath}`, {
    stdio: "inherit",
  });

  console.log(`Backup guardado en: ${hostPath}`);
} catch (error) {
  console.error(
    "Fallo el backup. Verifica que el contenedor de MongoDB esté corriendo (docker compose up -d mongodb) y que Docker esté disponible.",
  );
  process.exit(1);
}
