import { ConvertirComponente, convertirPath } from "../../helpers";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { Cargando } from "../components";
import { PageItem, usePageStore } from "../pages/Page";
import { useMemo } from "react";

const generarRutas = (
  data: PageItem[],
  padreId: string = "",
  path = ""
): JSX.Element[] => {
  return data
    .filter(({ padre }) => padre === padreId)
    .map((page) => {
      const newPath = path + convertirPath(page.nombre);
      return (
        <React.Fragment key={page._id}>
          <Route
            key={page._id}
            path={newPath + "/*"}
            element={ConvertirComponente(page.componente)}
          ></Route>
          {generarRutas(data, page._id, newPath + "/")}
        </React.Fragment>
      );
    });
};

export const ContentRouter = () => {
  const { data } = usePageStore();
  const { usuario } = useAuthStore();
  console.log({ data });

  const dataFilter = useMemo(
    () => data.filter(({ ver }) => ver.includes(usuario.rol)),
    [usuario, data]
  );
  if (data.length === 0) {
    return <Cargando titulo="Cargando" />;
  }
  return (
    <Routes>
      {generarRutas(dataFilter)}
      <Route
        path="/*"
        element={<Navigate replace to={convertirPath(data[0].nombre)} />}
      />
    </Routes>
  );
};

export default ContentRouter;
