import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { ErrorBackend } from "../../interfaces/global";
import { clienteAxios } from "../../api";

interface HttpHookOptions<T, BodyType> {
  initialUrl: string;
  initialMethod: "get" | "post" | "put" | "delete";
  initialBody: BodyType;
  initialData: T;
  fetchOnMount?: boolean;
}

export const useHttp = <T, BodyType>({
  initialUrl,
  initialMethod,
  initialBody,
  initialData,
  fetchOnMount = false,
}: HttpHookOptions<T, BodyType>) => {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<ErrorBackend>({ error: false, msg: "" });
  const [loading, setLoading] = useState(fetchOnMount);
  const [body, setBody] = useState<BodyType>(initialBody);

  const url = useMemo(() => initialUrl, []);
  const method = useMemo(() => initialMethod, []);

  const fetchData = useCallback(
    async (bodyParam = body) => {
      setLoading(true);
      try {
        let res;
        switch (method) {
          case "get":
            res = await clienteAxios.get<T>(url);
            break;
          case "post":
            res = await clienteAxios.post<T>(url, bodyParam);
            break;
          case "put":
            res = await clienteAxios.put<T>(url, bodyParam);
            break;
          case "delete":
            res = await clienteAxios.delete<T>(url);
            break;
          default:
            throw new Error("Invalid method");
        }

        setData(res.data);
        setError({ error: false, msg: "" });
      } catch (error: any) {
        console.log({ error });

        const msgError = error?.response?.data?.msg || "Error al consultar";
        toast.error(msgError);
        setError({
          error: true,
          msg: msgError,
        });
      } finally {
        setLoading(false);
      }
    },
    [body, url, method]
  );

  const refetchWithNewBody = async (newBody: BodyType) => {
    setBody(newBody);
    await fetchData(newBody);
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchData, fetchOnMount]);

  return {
    data: data,
    error,
    loading,
    setBody,
    refetch: fetchData,
    refetchWithNewBody,
    setData,
  };
};
