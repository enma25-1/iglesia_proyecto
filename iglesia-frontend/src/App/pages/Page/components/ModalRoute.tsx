import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { usePageStore } from "../hooks/usePageStore";
import { ModalPage } from "./ModalPage";
import { PageItem } from "../interfaces";
import { getSubPath} from "../../../../helpers";

export const ModalRoute = ({
  pagesData,
  cargando,
  
}: {
  pagesData: PageItem[];
  cargando: boolean;
  
}) => {
  const { setOpenModal, setItemActive, itemDefault, itemActive } =
    usePageStore();
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
      let itemFind = pagesData.find((pageI) => pageI._id === _id);

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

  return <ModalPage />;
};
