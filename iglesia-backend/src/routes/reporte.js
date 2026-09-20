import express from "express";
import path from "path";
import pdfmake from "pdfmake";
import { LogoModel } from "../models/Logo";
import { ConfirmacionModel } from "../models/Confirmacion";
import { MinistroModel } from "../models";

export const reporteRouter = express.Router();

reporteRouter.get("/pdf", async (req, res) => {
 try {
  // Extraer parámetro ID de la query (?ID=... o ?id=...)
  const id = req.query.ID || req.query.id || null;
  const confirma = await ConfirmacionModel.findOne({ _id: id });
  if (!confirma) {
    return res.status(404).json({ error: true, msg: "Confirmacion no encontrada" });
  }
  const ministro = await MinistroModel.findOne({
    _id: confirma.ministro._id,
  });
  const ministroConfirma = confirma.ministroConfirma?._id
    ? await MinistroModel.findOne({ _id: confirma.ministroConfirma._id })
    : null;

  const logo = await LogoModel.find();
  const logoUrl = logo[0]?.url;

  // Preparar valores desde la confirmación

  const libro = confirma && confirma.libro ? confirma.libro : "[libro]";
  const folio = confirma && confirma.folio ? confirma.folio : "[folio]";
  const parroquiaConfirmName =
    confirma && confirma.parroquiaConfirmacion
      ? confirma.parroquiaConfirmacion.name
      : "[Nombre de Parroquia]";
  const parroquiaBautName =
    confirma && confirma.parroquiaBustismo
      ? confirma.parroquiaBustismo.name
      : parroquiaConfirmName;
  const fullName =
    `${(confirma && confirma.nombres) || ""} ${(confirma && confirma.apellidos) || ""}`.trim();
  const fechaStr =
    confirma && confirma.fecha
      ? new Date(confirma.fecha).toLocaleString("es-ES", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })
      : "[Fecha]";
  const edad = (confirma && confirma.edad) || "[Edad]";
  const padres = (confirma && confirma.padre) || "[Nombres de Padres]";
  const padrinos = (confirma && confirma.padrino) || "[Nombres de Padrinos]";

  // Valores adicionales para formato similar a la imagen
  const fullNameUpper = fullName ? fullName.toUpperCase() : "[NOMBRE]";
  const ministroLabel = ministro && ministro.orden && ministro.orden.abreviatura
    ? `${ministro.orden.abreviatura} ${ministro.name}`
    : (ministro?.name || "");
  const ministroConfirmaLabel = ministroConfirma && ministroConfirma.orden && ministroConfirma.orden.abreviatura
    ? `${ministroConfirma.orden.abreviatura} ${ministroConfirma.name}`
    : (ministroConfirma?.name || "");
  const passportNote =
    confirma && confirma.passportNumber
      ? `NOMBRE CORRECTO SEGÚN PASAPORTE # ${confirma.passportNumber}: ${fullNameUpper}`
      : "";

  // Fecha actual para llenar espacios en el pie del documento
  const now = new Date(Date.now() - (60* 60 * 1000 *6));

  const dayToday = now.toLocaleString("es-ES", { day: "2-digit" });
  const monthToday = now.toLocaleString("es-ES", { month: "long" });
  const yearToday = now.getFullYear();
  // Intentar cargar logo local desde /uploads y convertir a data URI
  let fonts = {
    Roboto: {
      normal: path.join(__dirname, "../Roboto/Roboto-Regular.ttf"),
      bold: path.join(__dirname, "../Roboto/Roboto-Medium.ttf"),
      italics: path.join(__dirname, "../Roboto/Roboto-Italic.ttf"),
      bolditalics: path.join(__dirname, "../Roboto/Roboto-MediumItalic.ttf"),
    },
  };

  let printer = new pdfmake(fonts);

  let docDefinition = {
    content: [
      // Header con sello/escudo a la izquierda y texto central
      {
        columns: [
          logoUrl
            ? {
                image: logoUrl.replace("/", ""),
                width: 75,
              }
            : { text: "", width: 75 },
          {
            text: "Diócesis de Sonsonate \n El Salvador, C.A.",
            alignment: "center",
            fontSize: 16,
            bold: true,
            width: "70%",
          },
          {
            text: "",
            width: "15%",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Título principal grande
      {
        text: "CERTIFICACIÓN DE CONFIRMA",
        alignment: "center",
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 18],
      },

      // Texto introductorio (más estrecho)
      {
        text: `El infrascrito Obispo de la Diócesis de ${ministro?.depto?.name || "Sonsonate"}: ${ministroLabel}, certifica que:`,
        alignment: "justify",
    
        margin: [60, 0, 60, 14],
      },

      // Libro / Folio en línea
      {
        columns: [
          {
            text: `En el libro de Confirmaciones Nº: ${libro}`,
           
            width: "50%",
            margin: [60, 0, 0, 10],
          },
          {
            text: `Folio Nº: ${folio}`,
            
            width: "50%",
            margin: [0, 0, 60, 10],
            alignment: "right",
          },
        ],
      },

      // Texto que introduce el acta
      {
        text: "que se registra en el archivo de la Curia Diocesana, se encuentra el acta que literalmente dice:",
        
        margin: [60, 0, 60, 12],
      },

      // Datos del registro (etiquetas a la izquierda)
      {
        margin: [60, 0, 60, 18],
        stack: [
          {
            columns: [
              { text: "Ministro:", width: "25%", bold: true },
              { text: ministroConfirmaLabel, width: "25%", alignment: "left" },
              { text: "Obispo de:", width: "25%", bold: true },
              { text: ministroConfirma?.depto?.name || "", width: "25%", alignment: "left" },
            ],
            margin: [0, 6],
          },
          {
            columns: [],
            margin: [0, 6],
          },
          {
            columns: [
              { text: "El día:", width: "40%", bold: true },
              { text: fechaStr, width: "60%" },
            ],
            margin: [0, 6],
          },
          {
            columns: [
              { text: "En la Parroquia:", width: "40%", bold: true },
              { text: parroquiaConfirmName, width: "60%" },
            ],
            margin: [0, 6],
          },

          // Nombre confirmado en mayúsculas y destacado
          {
            columns: [
              { text: "Confirmó Solemnemente a:", width: "40%", bold: true },
              { text: fullNameUpper, width: "60%" },
            ],
            margin: [0, 8],
          },
          // Nota de pasaporte (si existe)
          passportNote
            ? {
                text: passportNote,
                
                italics: true,
                margin: [60 + 0, 2, 0, 6],
              }
            : { text: "", margin: [0, 0, 0, 0] },

          {
            columns: [
              { text: "a la edad de:", width: "40%", bold: true },
              { text: `${edad} años`, width: "60%" },
            ],
            margin: [0, 6],
          },
          {
            columns: [
              {
                text: "Bautizado/a en la Parroquia:",
                width: "40%",
                bold: true,
              },
              { text: parroquiaBautName, width: "60%" },
            ],
            margin: [0, 6],
          },
          {
            columns: [
              { text: "Siendo hijo/a de:", width: "40%", bold: true },
              { text: padres, width: "60%" },
            ],
            margin: [0, 6],
          },
          {
            columns: [
              { text: "Sus Padrinos:", width: "40%", bold: true },
              { text: padrinos, width: "60%" },
            ],
            margin: [0, 6],
          },
        ],
      },

      // Pie de documento (texto de certificación)
      {
        text: `La presente es copia del registro de Confirmaciones, al que me remito y para los usos que sean necesarios, se extiende la presente en la Oficina de la Curia Diocesana, a los: ${dayToday} días del mes de ${monthToday} de ${yearToday}.`,
        alignment: "justify",
      
        margin: [60, 0, 60, 30],
      },

      // Espacio para sello
      { text: "Nota :", margin: [60, 0, 0, 40] },
      { text: "Sello:", margin: [60, 0, 0, 40] },

      // Firma centrada
      {
        columns: [
          {
            text: "",
            width: "70%",
           
          },
          {
            text: `${ministroConfirmaLabel}\nObispo de ${ministroConfirma?.depto?.name || ""}, \n El Salvador, C.A.`,
            width: "30%",
        
            alignment: "center",
          },
        ],
        margin: [40, 0, 40, 20],
      },
    ],

    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 10],
        alignment: "center",
      },
      documentTitle: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 40],
        alignment: "center",
      },
      fieldLabel: {
        bold: true,
      
      },
    },

    defaultStyle: {
      font: "Roboto",
      fontSize: 12,
    },

    pageMargins: [20, 20, 20, 20],
  };

  let pdfDoc = printer.createPdfKitDocument(docDefinition);
  res.setHeader("Content-Type", "application/pdf");
  pdfDoc.pipe(res);
  pdfDoc.end();
 } catch (error) {
  console.log({ error });
  if (!res.headersSent) {
    res.status(500).json({ error: true, msg: "Error al generar el PDF" });
  }
 }
});