#!/usr/bin/env node
/**
 * Restaura un backup generado con backup-db.js en el contenedor Docker
 * de MongoDB definido en docker-compose.yml, usando mongorestore.
 *
 * ADVERTENCIA: usa --drop, es decir, reemplaza (borra e importa de nuevo)
 * las colecciones de la base de destino que también existan en el backup.
 * Pensado para restaurar sobre una instancia nueva/vacía al migrar de PC.
 *
 * Uso: node scripts/restore-db.js [archivo.archive.gz]
 *      npm run db:restore --workspace iglesia-backend -- iglesia-2026-01-01.archive.gz
 * Si no se indica archivo, usa el backup más reciente en dump/.
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
const fileArg = process.argv[2];

let filePath;
if (fileArg) {
  filePath = path.isAbsolute(fileArg) ? fileArg : path.join(dumpDir, fileArg);
} else {
  const files = fs.existsSync(dumpDir)
    ? fs
        .readdirSync(dumpDir)
        .filter((f) => f.endsWith(".archive.gz"))
        .sort()
    : [];
  if (files.length === 0) {
    console.error(
      `No hay backups en ${dumpDir}. Copia ahí el archivo generado en la PC de origen, o pasa su ruta como argumento.`,
    );
    process.exit(1);
  }
  filePath = path.join(dumpDir, files[files.length - 1]);
}

if (!fs.existsSync(filePath)) {
  console.error(`No se encontró el archivo de backup: ${filePath}`);
  process.exit(1);
}

const fileName = path.basename(filePath);
const containerPath = `/tmp/${fileName}`;

try {
  console.log(
    `Restaurando la base "${MONGO_DB}" en el contenedor "${CONTAINER}" desde ${filePath}...`,
  );

  execSync(`docker cp "${filePath}" ${CONTAINER}:${containerPath}`, {
    stdio: "inherit",
  });

  execSync(
    `docker exec ${CONTAINER} mongorestore --username ${MONGO_USER} --password ${MONGO_PASSWORD} --authenticationDatabase admin --archive=${containerPath} --gzip --drop`,
    { stdio: "inherit" },
  );

  execSync(`docker exec ${CONTAINER} rm ${containerPath}`, {
    stdio: "inherit",
  });

  console.log("Restauración completa.");
} catch (error) {
  console.error(
    "Fallo la restauración. Verifica que el contenedor de MongoDB esté corriendo (docker compose up -d mongodb) y que Docker esté disponible.",
  );
  process.exit(1);
}
