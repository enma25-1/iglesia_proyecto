import { Components, FromAnotherComponent } from "../../../interfaces/global";
import { useCallback, useEffect } from "react";
import { PaperContainerPage } from "../../components/style";
import { columns } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { Box, TableBody, TablePagination, TextField } from "@mui/material";
import {
  Acciones,
  Buscador,
  TablaLayout,
  TableNoData,
  TableTitle,
} from "../../components";
import { StaticConfirmacion } from "./components/StaticConfirmacion";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { ModalConfirmacion } from "./components/ModalConfirmacion";
import { ModalImprimirEncabezadoPie } from "./components/ModalImprimirEncabezadoPie";
import { useConfirmacionStore, useConfirmacionPage } from ".";
import { rowsPerPageOptions } from "../../../helpers";
import { TipoConfirmacion } from "./interfaces";

interface ConfirmacionProps extends FromAnotherComponent {
  // Permiten reutilizar esta misma página tanto para el apartado de
  // Confirmaciones normales como para el de Confirmaciones Supletorias
  // (ver Supletoria.tsx), sin duplicar el CRUD completo.
  tipo?: TipoConfirmacion;
  pageName?: Components;
}

export const Confirmacion = ({
  dontChangePath,
  tipo = "normal",
  pageName = "Confirmacion",
}: ConfirmacionProps) => {
  const {
    data,
    pagination,
    openModal,
    getDataConfirmacion,
    onEliminarConfirmacion,
    onClearStateConfirmacion,
    setOpenModal,
    setItemActive,
  } = useConfirmacionStore();

  // Fuerza el filtro por tipo en cada consulta al backend, sin exponerlo
  // como un campo editable en el formulario de búsqueda avanzada.
  const getDataConfirmacionScoped = useCallback(
    (arg: Parameters<typeof getDataConfirmacion>[0]) =>
      getDataConfirmacion({
        ...arg,
        busquedaAvanzada: { ...arg.busquedaAvanzada, tipo },
      }),
    [getDataConfirmacion, tipo],
  );

  const {
    buscando,
    busqueda,
    cargando,
    handleChangePage,
    handleChangeRowsPerPage,
    searchFunction,
    sort,
    sortFunction,
    busquedaAvanzada,
    handleEditar,
    handleDateChange,
    handleKeyDown,
    actions,
    openModalEncabezadoPie,
    setOpenModalEncabezadoPie,
  } = useConfirmacionPage({
    dontChangePath,
    getDataConfirmacion: getDataConfirmacionScoped,
    pagination,
    openModal,
    setItemActive,
    setOpenModal,
    pageName,
    tipo,
  });

  // Cleanup effect
  useEffect(() => {
    return () => {
      onClearStateConfirmacion();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaperContainerPage tabIndex={-1} onKeyDown={handleKeyDown}>
      <ModalConfirmacion />
      <ModalImprimirEncabezadoPie
        open={openModalEncabezadoPie}
        onClose={() => setOpenModalEncabezadoPie(false)}
        tipo={tipo}
      />
      <Buscador
        label="Buscar"
        buscando={buscando}
        cargando={cargando}
        busqueda={busqueda}
        onSearch={(value) => searchFunction(true, value)}
        onSearchCancel={() => searchFunction(false, "")}
      />
      <Box display={"flex"} gap={2}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Inicio"
          value={busquedaAvanzada.fecha1}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleDateChange("fecha1", e.target.value)}
        />
        <TextField
          fullWidth
          type="date"
          label="Fecha Fin"
          value={busquedaAvanzada.fecha2}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleDateChange("fecha2", e.target.value)}
        />
      </Box>
      <TableTitle
        texto={
          tipo === "supletoria"
            ? "CONFIRMACIONES SUPLETORIAS"
            : "CONFIRMACIONES"
        }
        Tabs={[]}
      />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Acciones actions={actions} />
        <TablePagination
          className="tablePagination"
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={pagination.totalDocs}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <TablaLayout>
        <TableHeader
          columns={columns}
          sort={sort}
          sortFunction={sortFunction}
        />
        {cargando ? (
          <TableCargando columnsLength={columns.length} />
        ) : (
          <TableBody>
            {data.length === 0 ? (
              <TableNoData
                length={columns.length}
                title={
                  tipo === "supletoria"
                    ? "No hay Confirmaciones Supletorias"
                    : "No hay Confirmaciones"
                }
              />
            ) : (
              data.map((confirmacion) => (
                <StaticConfirmacion
                  key={confirmacion._id}
                  confirmacion={confirmacion}
                  busqueda={busqueda}
                  onEliminarConfirmacion={onEliminarConfirmacion}
                  handleEditar={handleEditar}
                  pageName={pageName}
                />
              ))
            )}
          </TableBody>
        )}
      </TablaLayout>
    </PaperContainerPage>
  );
};

export default Confirmacion;
