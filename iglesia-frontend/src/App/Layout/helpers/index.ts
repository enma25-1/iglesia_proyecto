import { clienteAxios } from "../../../api";
import { ErrorBackend } from "../../../interfaces/global";
import { PageItem } from "../../pages/Page";

interface MyResponse {
  data: { data: PageItem[] };
}

type getPagesType = () => Promise<{
  error: ErrorBackend;
  data: PageItem[];
}>;

export const getPages: getPagesType = async () => {
  try {
    const res: MyResponse = await clienteAxios.get("/page");

    return {
      data: res.data.data,
      error: { msg: "", error: false },
    };
  } catch (error: any) {
    console.log({ error });

    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar modulos",
      error: true,
    };

    return { error: errorResult, data: [] };
  }
};
