import express from "express";
import path from "path";
import pdfmake from "pdfmake";
import { LogoModel } from "../models/Logo";
import { ConfirmacionModel } from "../models/Confirmacion";
import { MinistroModel } from "../models";

export const reporteRouter = express.Router();

// Estas medidas son las MISMAS para el modo "completo" (encabezado, cuerpo y
// pie fluyen juntos, un solo documento) y para los modos "fijos"
// (encabezado_pie / cuerpo: dos pasadas de impresión sobre la misma hoja
// física). La idea es que el modo fijo sea literalmente un "corte" del mismo
// documento completo, no un diseño aparte con números distintos.
const PAGE_MARGIN_X = 20;
// Espacio entre el borde superior y el logo/título (modo completo: margen de
// página; modo fijo: margen propio del header, ya que no recibe pageMargins).
const HEADER_TOP_INSET = 20;
// Alto real del bloque de encabezado (logo + título, hasta 2 líneas en
// Supletoria: "SUPLETORIA DE" / "CERTIFICACIÓN DE CONFIRMA").
const HEADER_CONTENT_HEIGHT = 125;
// Espacio entre el encabezado y el cuerpo: igual en ambos modos.
const HEADER_GAP_AFTER = 20;
const HEADER_HEIGHT = HEADER_TOP_INSET + HEADER_CONTENT_HEIGHT + HEADER_GAP_AFTER;

// Espacio entre el cuerpo y el pie: igual en ambos modos.
const FOOTER_GAP_BEFORE = 24;
// Alto real del bloque de pie (texto de cierre + Sello + espacio para firmar + firma).
const FOOTER_CONTENT_HEIGHT = 155;
// 40pt (~0.5") de margen de seguridad antes del borde físico de la hoja: el
// pie no debe quedar pegado al borde, ya que muchas impresoras no imprimen
// hasta el último milímetro.
const FOOTER_SAFE_BOTTOM = 40;
const FOOTER_HEIGHT = FOOTER_GAP_BEFORE + FOOTER_CONTENT_HEIGHT + FOOTER_SAFE_BOTTOM;

reporteRouter.get("/pdf", async (req, res) => {
 try {
  // Extraer parámetro ID de la query (?ID=... o ?id=...)
  const id = req.query.ID || req.query.id || null;

  // Modo de impresión: completo (default) | encabezado_pie | cuerpo
  // Permite imprimir solo encabezado+pie (para dejar hojas pre-firmadas, en
  // blanco, sin datos de ningún confirmado) o solo el cuerpo (para completar
  // después sobre una hoja ya firmada).
  const modoRaw = req.query.modo || req.query.mode || "completo";
  const modo = ["completo", "encabezado_pie", "cuerpo"].includes(modoRaw)
    ? modoRaw
    : "completo";
  const showHeader = modo === "completo" || modo === "encabezado_pie";
  const showBody = modo === "completo" || modo === "cuerpo";
  const showFooter = modo === "completo" || modo === "encabezado_pie";

  // "encabezado_pie" es una hoja en blanco genérica: no depende de ningún
  // confirmado en particular, solo del tipo de certificado (tipo=normal|
  // supletoria). El ministro que firma es opcional (la firma suele hacerse a
  // mano): si se indica (ministroId), se imprime su nombre; si no, el pie
  // queda genérico, sin nombre, para firmar a mano.
  const esStandaloneEncabezadoPie = modo === "encabezado_pie" && !id;

  let confirma = null;
  let ministro = null;
  let ministroConfirma = null;
  let esSupletoria = false;

  if (esStandaloneEncabezadoPie) {
    esSupletoria = (req.query.tipo || "normal") === "supletoria";
    const ministroConfirmaId = req.query.ministroId || req.query.ministroConfirmaId;
    ministroConfirma = ministroConfirmaId
      ? await MinistroModel.findOne({ _id: ministroConfirmaId })
      : null;
  } else {
    confirma = await ConfirmacionModel.findOne({ _id: id });
    if (!confirma) {
      return res.status(404).json({ error: true, msg: "Confirmacion no encontrada" });
    }
    ministro = await MinistroModel.findOne({
      _id: confirma.ministro._id,
    });
    ministroConfirma = confirma.ministroConfirma?._id
      ? await MinistroModel.findOne({ _id: confirma.ministroConfirma._id })
      : null;
    esSupletoria = confirma && confirma.tipo === "supletoria";
  }

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
  const observacion = (confirma && confirma.observacion) || "";

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

  // Fecha para el texto de cierre del pie. Por defecto es la fecha actual,
  // pero se puede elegir otra (ej. la hoja en blanco se genera hoy pero se
  // firmará/usará después) vía ?fechaPie=YYYY-MM-DD.
  const fechaPieParam = req.query.fechaPie || req.query.fechaCierre;
  const now = fechaPieParam
    ? (() => {
        const [y, m, d] = fechaPieParam.split("-").map(Number);
        // Mediodía local: evita que el corrimiento de zona horaria mueva la
        // fecha elegida al día anterior.
        return new Date(y, (m || 1) - 1, d || 1, 12);
      })()
    : new Date(Date.now() - (60* 60 * 1000 *6));

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

  // "encabezado_pie" y "cuerpo" son las dos pasadas de un mismo trabajo de
  // impresión físico (hoja pre-firmada en blanco, luego el cuerpo reimpreso
  // sobre esa misma hoja): necesitan que el pie caiga SIEMPRE en la misma
  // posición fija, sin importar cuánto cuerpo haya. "completo" es un
  // documento normal de una sola pasada: el pie simplemente fluye justo
  // después del cuerpo, sin el hueco en blanco que deja fijarlo al fondo.
  const esModoFijo = modo === "encabezado_pie" || modo === "cuerpo";

  // Encabezado: logo/diócesis + título. No lleva datos del confirmado.
  const headerStack = !showHeader
    ? null
    : {
        stack: [
          {
            columns: [
              logoUrl
                ? { image: logoUrl.replace("/", ""), width: 75 }
                : { text: "", width: 75 },
              {
                text: "Diócesis de Sonsonate \n El Salvador, C.A.",
                alignment: "center",
                fontSize: 16,
                bold: true,
                width: "*",
              },
              { text: "", width: 75 },
            ],
            margin: [0, 0, 0, 4],
          },
          esSupletoria
            ? {
                stack: [
                  { text: "SUPLETORIA DE", alignment: "center", fontSize: 18, bold: true },
                  { text: "CERTIFICACIÓN DE CONFIRMA", alignment: "center", fontSize: 18, bold: true },
                ],
              }
            : {
                text: "CERTIFICACIÓN DE CONFIRMA",
                alignment: "center",
                fontSize: 18,
                bold: true,
              },
        ],
      };

  // Pie de página: texto de certificación genérico, "Sello:" y la firma.
  // No lleva la Observación (dato del confirmado, va en el cuerpo).
  const footerStack = !showFooter
    ? null
    : {
        stack: [
          {
            text: `La presente es copia del registro de ${esSupletoria ? "Supletorias" : "Confirmaciones"}, al que me remito y para los usos que sean necesarios, se extiende la presente en la Oficina de la Curia Diocesana, a los: ${dayToday} días del mes de ${monthToday} de ${yearToday}.`,
            alignment: "justify",
            margin: [60, 0, 60, 12],
          },
          // Más espacio antes de la firma, para que el obispo firme a mano.
          { text: "Sello:", margin: [60, 0, 0, 40] },
          {
            columns: [
              { text: "", width: "40%" },
              {
                // Sin ministro elegido (firma a mano): no se imprime ningún
                // nombre, solo la etiqueta genérica de la sede.
                text: ministroConfirma
                  ? `${ministroConfirmaLabel}\nObispo de ${ministroConfirma?.depto?.name || ""}, \n El Salvador, C.A.`
                  : "Obispo de la Diócesis de Sonsonate,\nEl Salvador, C.A.",
                width: "60%",
                alignment: "center",
              },
            ],
            margin: [40, 0, 40, 0],
          },
        ],
      };

  // Header/footer "fijos" (pdfmake los ancla al tope/fondo usando pageMargins);
  // en modo fijo llevan su propio margen porque no reciben el margen de
  // página. Usan las mismas constantes que el modo "completo" (ver arriba):
  // literalmente el mismo encabezado/pie, solo "cortado" en una hoja aparte.
  const header =
    esModoFijo && headerStack
      ? { margin: [PAGE_MARGIN_X, HEADER_TOP_INSET, PAGE_MARGIN_X, 0], ...headerStack }
      : undefined;
  const footer =
    esModoFijo && footerStack
      ? { margin: [PAGE_MARGIN_X, FOOTER_GAP_BEFORE, PAGE_MARGIN_X, FOOTER_SAFE_BOTTOM], ...footerStack }
      : undefined;

  // Cuerpo: datos del confirmado. En el modo "encabezado_pie" va vacío (hoja
  // en blanco para pre-firmar, sin ningún dato incrustado).
  const bodyContent = !showBody
    ? []
    : [
        {
          text: esSupletoria
            ? `El infrascrito Obispo de la Diócesis de ${ministro?.depto?.name || "Sonsonate"}: ${ministroLabel}, por falta de registros que confirmen la realización del Sacramento de la Confirmación, certifica que:`
            : `El infrascrito Obispo de la Diócesis de ${ministro?.depto?.name || "Sonsonate"}: ${ministroLabel}, certifica que:`,
          alignment: "justify",
          margin: [60, 10, 60, 14],
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
                { text: "Ministro:", width: "40%", bold: true },
                { text: ministroConfirmaLabel, width: "60%" },
              ],
              margin: [0, 6],
            },
            {
              columns: [
                { text: "Obispo de:", width: "40%", bold: true },
                { text: ministroConfirma?.depto?.name || "", width: "60%" },
              ],
              margin: [0, 6, 0, 12],
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
                  margin: [60, 2, 0, 6],
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

        // Observación es dato del confirmado: vive en el cuerpo, no en el pie
        {
          text: `Observación: ${observacion}`,
          margin: [60, 0, 60, 0],
        },
      ];

  // Modo fijo (encabezado_pie / cuerpo): header/footer pinneados vía
  // pageMargins, content = solo el cuerpo. Modo "completo": todo fluye junto
  // en content, con márgenes normales, para que el pie no deje un hueco en
  // blanco cuando el cuerpo es corto.
  const content = esModoFijo
    ? bodyContent
    : [
        ...(headerStack
          ? [{ ...headerStack, margin: [0, 0, 0, HEADER_GAP_AFTER] }]
          : []),
        ...bodyContent,
        ...(footerStack
          ? [{ ...footerStack, margin: [0, FOOTER_GAP_BEFORE, 0, 0] }]
          : []),
      ];

  let docDefinition = {
    header,
    footer,
    content,

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

    pageMargins: esModoFijo
      ? [PAGE_MARGIN_X, HEADER_HEIGHT, PAGE_MARGIN_X, FOOTER_HEIGHT]
      : [PAGE_MARGIN_X, HEADER_TOP_INSET, PAGE_MARGIN_X, FOOTER_SAFE_BOTTOM],
  };

  let pdfDoc = printer.createPdfKitDocument(docDefinition);
  res.setHeader("Content-Type", "application/pdf");
  // Nombre sugerido al ver/guardar el PDF desde el navegador.
  let nombreArchivo;
  if (modo === "encabezado_pie" && esStandaloneEncabezadoPie) {
    nombreArchivo = esSupletoria
      ? "Encabezado Supletoria.pdf"
      : "Encabezado Normal.pdf";
  } else if (confirma) {
    const nombreConfirmado = `${confirma.nombres || ""} ${confirma.apellidos || ""}`.trim();
    const sufijo = modo === "cuerpo" ? " - cuerpo" : "";
    nombreArchivo = `Confirmacion - ${nombreConfirmado}${sufijo}.pdf`;
  }
  if (nombreArchivo) {
    res.setHeader("Content-Disposition", `inline; filename="${nombreArchivo}"`);
  }
  pdfDoc.pipe(res);
  pdfDoc.end();
 } catch (error) {
  console.log({ error });
  if (!res.headersSent) {
    res.status(500).json({ error: true, msg: "Error al generar el PDF" });
  }
 }
});
