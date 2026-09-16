import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ModalUsuario } from "./ModalUsuario";
import { UsuarioItem } from "../interfaces";
import { getSubPath } from "../../../../helpers";

export const ModalRoute = ({
  usuariosData,
  cargando,
}: {
  usuariosData: UsuarioItem[];
  cargando: boolean;
  
}) => {
  const { setOpenModal, setItemActive, itemDefault, itemActive } =
    useUsuarioStore();
  const { _id } = useParams<{ _id: string }>();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate(getSubPath());

    setOpenModal(false);
  };
  useEffect(() => {
    if (cargando) return;
    if (_id === "nuevo") {
    } else {
      let itemFind = usuariosData.find((usuarioI) => usuarioI._id === _id);

      if (itemFind) {
        if (itemActive._id !== itemFind._id) {
          setItemActive(itemFind);
        }
      } else {
        if (itemActive._id) {
          setItemActive(itemActive, true);
        } else {
          onBackPage();
          setItemActive(itemDefault, true);
        }
      }
    }
    // return () => {
    //   if (!isThereNextPath(prevPath)) {
    //     setItemActive(itemDefault, true);
    //   }
    // };
  }, [_id, cargando]);

  return <ModalUsuario />;
};
