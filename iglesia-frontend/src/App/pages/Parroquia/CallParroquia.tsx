import { IconButton, Tooltip } from "@mui/material";
import { ModalLayout } from "../../components";
import {
  StyledContainerForm,
  StyledModalBoxHeader,
  StyledTypographyHeader,
} from "../../components/style";
import { Cancel } from "@mui/icons-material";
import Parroquia from "./Parroquia";
import { useNavigate } from "react-router-dom";
import { getSubPath } from "../../../helpers";
import { useModalConfig } from "../../hooks";
// import { usePath } from "../../../hooks";

export const CallParroquia = () => {
  const { idModal, vhContainer, width } = useModalConfig(
    "idModalParroquia",
    undefined,
    {
      height: { lg: "100", md: "100", xs: "100" },
      footer_height: 0,
      header_height: 40,
    },
    { lg: "100", md: "100", xs: "100" }
  );
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(getSubPath());
  };
  return (
    <ModalLayout
      idModal={idModal}
      open
      setOpen={() => {}}
      vh={vhContainer.height}
      width={width}
    >
      <>
        <StyledModalBoxHeader>
          <StyledTypographyHeader color={"primary"} id={idModal}>
            Departamentos
          </StyledTypographyHeader>
          <Tooltip title="Cancelar">
            <IconButton
              aria-label="Cancelar"
              onClick={handleClose}
              color="error"
            >
              <Cancel />
            </IconButton>
          </Tooltip>
        </StyledModalBoxHeader>

        <StyledContainerForm {...vhContainer}>
          <Parroquia />
        </StyledContainerForm>
      </>
    </ModalLayout>
  );
};
