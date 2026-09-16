import { FromAnotherComponent } from "../../../interfaces/global";
import { useEffect } from "react";
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
import { useConfirmacionStore, useConfirmacionPage } from ".";
import { rowsPerPageOptions } from "../../../helpers";

export const Confirmacion = ({ dontChangePath }: FromAnotherComponent) => {
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
    path,
    handleEditar,
    handleDateChange,
    handleKeyDown,
    actions,
  } = useConfirmacionPage({
    dontChangePath,
    getDataConfirmacion,
    pagination,
    openModal,
    setItemActive,
    setOpenModal,
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
      <TableTitle texto={path} Tabs={[]} />
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
                title="No hay Confirmaciones"
              />
            ) : (
              data.map((confirmacion) => (
                <StaticConfirmacion
                  key={confirmacion._id}
                  confirmacion={confirmacion}
                  busqueda={busqueda}
                  onEliminarConfirmacion={onEliminarConfirmacion}
                  handleEditar={handleEditar}
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
