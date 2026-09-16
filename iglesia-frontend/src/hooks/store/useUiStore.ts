import { useDispatch, useSelector } from "react-redux";
import {
  onSToogleSidebar,
  onSToogleSidebarMobile,
  setSOpenProfileModal,
} from "../../store/ui";
import { RootState } from "../../store/interfaces";

export const useUiStore = () => {
  const {
    openDrawerSidebar,
    openDrawerSidebarMobile,
    openModalProfile,
  } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();

  const onToogleSidebar = () => {
    dispatch(onSToogleSidebar());
  };
  const onToogleSidebarMobile = () => {
    dispatch(onSToogleSidebarMobile());
  };
  const setOpenProfileModal = (openValue: boolean) => {
    dispatch(setSOpenProfileModal(openValue));
  };

  return {
    openDrawerSidebar,
    openDrawerSidebarMobile,
    openModalProfile,
    onToogleSidebar,
    onToogleSidebarMobile,
    setOpenProfileModal,
  };
};
