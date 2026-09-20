import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { DeptoModel } from "../models/Depto";
import { DistritoModel } from "../models/Distrito";
import { MunicipioModel } from "../models/Municipio";
import { ParroquiaModel } from "../models/Parroquia";
import { UsuarioModel } from "../models/Usuario";
import { MinistroModel } from "../models/Ministro";
import { ConfirmacionModel } from "../models/Confirmacion";
import { PageModel } from "../models/Page";
import { LogoModel } from "../models/Logo";
import { roles } from "../helpers/usuarioProps";
import fs from "fs";
import path from "path";

const SEED_FLAG_COLLECTION = "seed_flags";
const SEED_FLAG_ID = "main_seed_v1";
const DATOS_DIR = path.resolve(process.cwd(), "datos");

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function readCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h.trim()] = (values[idx] || "").trim();
      });
      result.push(row);
    }
  }
  return result;
}

function normalize(name) {
  return name.toUpperCase().replace(/[ÁÉÍÓÚÜ]/g, (c) => {
    const map = { "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U", "Ü": "U" };
    return map[c] || c;
  });
}

async function seedAdminUsuario() {
  const username = "admin";
  const existing = await UsuarioModel.findOne({ username });
  if (existing) {
    console.log("Usuario admin ya existe. Omitiendo.");
    return existing;
  }
  const salt = bcryptjs.genSaltSync();
  const password = bcryptjs.hashSync("1234admin", salt);
  const admin = await UsuarioModel.create({
    name: "Administrador",
    lastname: "Sistema",
    tel: "00000000",
    username,
    password,
    rol: "ADMINISTRADOR",
    estado: true,
  });
  console.log("Usuario admin creado (admin / 1234admin)");
  return admin;
}

async function seedPages(adminUsuario) {
  const existing = await PageModel.findOne({});
  if (existing) {
    console.log("Ya existen pages/menu. Omitiendo.");
    return;
  }
  if (!adminUsuario) {
    console.log("No hay usuario admin, no se puede crear el menu.");
    return;
  }

  const paginas = [
    { componente: "Page", nombre: "Menus", icono: "MenuBook", orden: 1 },
    { componente: "Usuario", nombre: "Usuarios", icono: "People", orden: 2 },
    { componente: "Depto", nombre: "Departamentos", icono: "LocationOn", orden: 3 },
    { componente: "Parroquia", nombre: "Parroquias", icono: "Church", orden: 4 },
    { componente: "Ministro", nombre: "Ministros", icono: "Groups", orden: 5 },
    { componente: "Confirmacion", nombre: "Confirmaciones", icono: "Assignment", orden: 6 },
  ];

  await PageModel.insertMany(
    paginas.map((pagina) => ({
      ...pagina,
      padre: "",
      tipo: "ITEM",
      ver: roles,
      insert: ["ADMINISTRADOR"],
      update: ["ADMINISTRADOR"],
      delete: ["ADMINISTRADOR"],
      rUsuario: adminUsuario._id,
    })),
  );
  console.log(`Menu creado (${paginas.length} paginas).`);
}

async function seedLogoDefault() {
  const existing = await LogoModel.findOne({});
  if (existing) {
    console.log("Ya existe un logo. Omitiendo.");
    return;
  }

  const logoSource = path.join(DATOS_DIR, "logo.jpg");
  if (!fs.existsSync(logoSource)) {
    console.log("No se encuentra datos/logo.jpg, no se puede crear el logo por defecto.");
    return;
  }

  const uploadsDir = path.resolve(process.cwd(), "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  const logoDest = path.join(uploadsDir, "logo.jpg");
  fs.copyFileSync(logoSource, logoDest);

  await LogoModel.create({ url: "/uploads/logo.jpg" });
  console.log("Logo por defecto creado.");
}

async function seedConfirmacionDemo() {
  const existing = await ConfirmacionModel.findOne({});
  if (existing) {
    console.log("Ya existe al menos una confirmacion. Omitiendo.");
    return;
  }

  const parroquia = await ParroquiaModel.findOne({});
  if (!parroquia) {
    console.log(
      "No hay parroquias registradas, no se puede crear la confirmacion de ejemplo.",
    );
    return;
  }

  let ministro = await MinistroModel.findOne({});
  if (!ministro) {
    ministro = await MinistroModel.create({
      name: "Monseñor de Ejemplo",
      orden: { name: "Obispo", abreviatura: "Mons." },
      estado: true,
      municipio: parroquia.municipio,
      distrito: parroquia.distrito,
      depto: parroquia.depto,
    });
    console.log("Ministro de ejemplo creado.");
  }

  await ConfirmacionModel.create({
    apellidos: "Pérez Gómez",
    nombres: "Juan Carlos",
    edad: "15",
    parroquiaBustismo: {
      _id: parroquia._id,
      name: parroquia.name,
      direccion: parroquia.direccion,
    },
    parroquiaConfirmacion: {
      _id: parroquia._id,
      name: parroquia.name,
      direccion: parroquia.direccion,
    },
    ministro: {
      _id: ministro._id,
      name: ministro.name,
      orden: ministro.orden,
    },
    padre: "Carlos Pérez",
    madre: "María Gómez",
    padrino: "José Ramírez",
    madrina: "Ana López",
    fecha: new Date(),
    libro: 1,
    folio: 1,
    observacion: "Registro de ejemplo generado por el seed.",
  });
  console.log("Confirmacion de ejemplo creada.");
}

export const runSeed = async () => {
  console.log("Iniciando seed de datos...");

  const adminUsuario = await seedAdminUsuario();
  await seedPages(adminUsuario);
  await seedLogoDefault();

  const flag = await mongoose.connection.db
    .collection(SEED_FLAG_COLLECTION)
    .findOne({ _id: SEED_FLAG_ID });
  if (flag) {
    console.log("Seed ya ejecutado anteriormente. Omitiendo.");
    await seedConfirmacionDemo();
    return;
  }

  await mongoose.connection.db.collection("deptos").drop().catch(() => {});
  await mongoose.connection.db.collection("municipios").drop().catch(() => {});
  await mongoose.connection.db.collection("distritos").drop().catch(() => {});
  await mongoose.connection.db.collection("parroquias").drop().catch(() => {});

  const distPath = path.join(DATOS_DIR, "distribucion_262_distritos_el_salvador.csv");
  if (!fs.existsSync(distPath)) {
    console.log("No se encuentra distribucion_262_distritos_el_salvador.csv");
    return;
  }

  const distRows = readCSV(distPath);
  if (distRows.length === 0) {
    console.log("CSV de distribucion vacio");
    return;
  }

  const deptoNames = [...new Set(distRows.map((r) => normalize(r.departamento)))].sort();
  console.log("Insertando departamentos...");
  await DeptoModel.insertMany(
    deptoNames.map((name) => ({ name })),
    { ordered: false }
  );
  const deptos = await DeptoModel.find({}).sort({ name: 1 });
  const deptoMap = {};
  deptos.forEach((d) => { deptoMap[d.name] = d._id; });
  console.log(`   ${deptos.length} departamentos`);

  const municipioDocs = [];
  const seenMunicipio = new Set();
  for (const row of distRows) {
    const name = normalize(row.municipio);
    const key = `${name}|${normalize(row.departamento)}`;
    if (seenMunicipio.has(key)) continue;
    seenMunicipio.add(key);
    municipioDocs.push({ name, depto: deptoMap[normalize(row.departamento)] });
  }

  console.log("Insertando municipios...");
  try {
    await MunicipioModel.insertMany(municipioDocs, { ordered: false });
  } catch (e) {}
  const municipios = await MunicipioModel.find({});
  const municipioByName = {};
  municipios.forEach((m) => {
    if (!municipioByName[m.name]) municipioByName[m.name] = [];
    municipioByName[m.name].push(m);
  });
  console.log(`   ${municipios.length} municipios`);

  const distritoDocs = [];
  const seenDistrito = new Set();
  for (const row of distRows) {
    const name = normalize(row.distrito);
    const depto = normalize(row.departamento);
    const key = `${name}|${depto}`;
    if (seenDistrito.has(key)) continue;
    seenDistrito.add(key);
    const municipioName = normalize(row.municipio);
    const munDoc = municipioByName[municipioName]?.find(
      (m) => String(m.depto) === String(deptoMap[depto])
    );
    if (munDoc) {
      distritoDocs.push({
        name,
        depto: deptoMap[depto],
        municipio: munDoc._id,
      });
    }
  }

  console.log("Insertando distritos...");
  try {
    await DistritoModel.insertMany(distritoDocs, { ordered: false });
  } catch (e) {}
  const distritos = await DistritoModel.find({});
  const distritoByName = {};
  distritos.forEach((d) => {
    if (!distritoByName[d.name]) distritoByName[d.name] = [];
    distritoByName[d.name].push(d);
  });
  console.log(`   ${distritos.length} distritos`);

  const parroquiasCSVPath = path.join(DATOS_DIR, "Parroquias_Sonsonate_Restructurado.csv");
  if (fs.existsSync(parroquiasCSVPath)) {
    const parroquiasRows = readCSV(parroquiasCSVPath);
    if (parroquiasRows.length > 0) {
      console.log(`Insertando ${parroquiasRows.length} parroquias desde CSV...`);
      const parroquiasData = [];
      for (const row of parroquiasRows) {
        const name = (row.Nombre || "").trim();
        const direccion = (row["Dirección"] || "").trim();
        const distritoName = normalize(row.Distrito || "");
        const municipioName = normalize(row.Municipio || "");
        const deptoName = normalize(row.Departamento || "");
        if (!name || !direccion || !distritoName || !municipioName || !deptoName) continue;
        const deptoDoc = deptoMap[deptoName];
        const munDocs = municipioByName[municipioName]?.filter(
          (m) => String(m.depto) === String(deptoDoc)
        );
        const distritoList = distritoByName[distritoName]?.filter(
          (d) => String(d.depto) === String(deptoDoc)
        );
        if (!deptoDoc || !munDocs?.length || !distritoList?.length) {
          console.warn(`   No se pudo resolver: ${municipioName} / ${distritoName} (${name})`);
          continue;
        }
        parroquiasData.push({
          name,
          direccion,
          estado: true,
          municipio: { _id: munDocs[0]._id, name: munDocs[0].name },
          distrito: { _id: distritoList[0]._id, name: distritoList[0].name },
          depto: { _id: deptoDoc, name: deptoName },
        });
      }
      if (parroquiasData.length > 0) {
        try {
          await ParroquiaModel.insertMany(parroquiasData, { ordered: false });
        } catch (e) {}
      }
      const parroquiaCount = await ParroquiaModel.countDocuments();
      console.log(`   ${parroquiaCount} parroquias en base de datos`);
    }
  }

  await seedConfirmacionDemo();

  await mongoose.connection.db
    .collection(SEED_FLAG_COLLECTION)
    .insertOne({ _id: SEED_FLAG_ID, executedAt: new Date() });

  console.log("Seed completado exitosamente!");
};
