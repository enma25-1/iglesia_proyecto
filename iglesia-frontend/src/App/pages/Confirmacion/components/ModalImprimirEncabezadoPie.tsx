import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useHttp } from "../../../hooks";
import { MinistroForeign, getMinistroDisplayName } from "../../Ministro";
import { TipoConfirmacion } from "../interfaces";
import { clienteAxios } from "../../../../api";

interface ModalImprimirEncabezadoPieProps {
  open: boolean;
  onClose: () => void;
  // El tipo lo define la página desde la que se abre el modal (Confirmación
  // normal o Confirmaciones Supletorias), no hay que volver a preguntarlo.
  tipo: TipoConfirmacion;
}

// Modal independiente de cualquier registro de Confirmación: genera una hoja
// en blanco (solo encabezado y pie, sin datos de ningún confirmado) para que
// el obispo la pre-firme. Elegir el ministro es opcional: si se elige, su
// nombre se imprime en la firma; si no, queda en blanco para firmar a mano.
// YYYY-MM-DD en horario local (evita que toISOString() corra un día por UTC).
const hoyLocal = () => {
  const hoy = new Date();
  const offset = hoy.getTimezoneOffset() * 60000;
  return new Date(hoy.getTime() - offset).toISOString().slice(0, 10);
};

export const ModalImprimirEncabezadoPie = ({
  open,
  onClose,
  tipo,
}: ModalImprimirEncabezadoPieProps) => {
  const { data: ministrosData } = useHttp<MinistroForeign[], {}>({
    initialBody: {},
    initialData: [],
    initialMethod: "get",
    initialUrl: "/ministro/getAllF",
    fetchOnMount: true,
  });
  const [ministro, setMinistro] = useState<MinistroForeign | null>(null);
  const [fecha, setFecha] = useState(hoyLocal);

  const handleCerrar = () => {
    setMinistro(null);
    setFecha(hoyLocal());
    onClose();
  };

  const handleVerPdf = () => {
    const ministroParam = ministro ? `&ministroId=${ministro._id}` : "";
    const fechaParam = fecha ? `&fechaPie=${fecha}` : "";
    window.open(
      `${clienteAxios.defaults.baseURL}/reporte/pdf?modo=encabezado_pie&tipo=${tipo}${ministroParam}${fechaParam}`,
      "_blank",
    );
    handleCerrar();
  };

  return (
    <Dialog open={open} onClose={handleCerrar} fullWidth maxWidth="xs">
      <DialogTitle>
        {tipo === "supletoria"
          ? "Imprimir solo encabezado y pie (Supletoria)"
          : "Imprimir solo encabezado y pie"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          Genera una hoja en blanco (sin datos de ningún confirmado) para
          pre-firmar. El ministro/obispo es opcional: si lo eliges, su nombre
          se imprime en la firma; si lo dejas vacío, queda en blanco para
          firmar a mano.
        </Typography>
        <Autocomplete
          options={ministrosData}
          value={ministro}
          getOptionLabel={(value) => getMinistroDisplayName(value)}
          isOptionEqualToValue={(option, value) => option._id === value?._id}
          onChange={(_, newValue) => setMinistro(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Obispo/Ministro que firma (opcional)"
              autoFocus
            />
          )}
        />
        <TextField
          type="date"
          label="Fecha del pie"
          value={fecha}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setFecha(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCerrar}>Cancelar</Button>
        <Button variant="contained" onClick={handleVerPdf}>
          Ver PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};
