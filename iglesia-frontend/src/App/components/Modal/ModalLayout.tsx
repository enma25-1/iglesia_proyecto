import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Draggable from "react-draggable";

export const ModalLayout = ({
  children,
  idModal,
  open,
  setOpen,
  vh,
  width = {
    lg: "60",
    md: "80",
    xs: "100",
  },
}: {
  children?: JSX.Element;
  idModal: string;
  open: boolean;
  setOpen: (arg: boolean) => void;
  vh: {
    xs?: string;
    md?: string;
    lg?: string;
  };
  width?: {
    xs?: string;
    md?: string;
    lg?: string;
  };
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      className="animate__animated animate__fadeIn"
      sx={{ animationDuration: ".25s" }}
    >
      <Grid container>
        {/* [ "xs", "xs", "md", "lg", "xl" ] */}
        <Box
          sx={{
            minHeight: {
              xs: `${vh.xs}%`,
              md: `${vh.md}%`,
              lg: `${vh.lg}%`,
            },
            height: {
              xs: `${vh.xs}%`,
              md: `${vh.md}%`,
              lg: `${vh.lg}%`,
            },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: `${width.xs}%`,
              md: `${width.md}%`,
              lg: `${width.lg}%`,
            },
            border: "none",
            background: "transparent",
          }}
        >
          <Draggable handle={`#${idModal}`}>
            <Box
              sx={{
                background: (theme) => theme.palette.background.paper,
                borderRadius: "20px",
                boxShadow: (theme) => theme.shadows[24],
              }}
            >
              {children}
            </Box>
          </Draggable>
        </Box>
      </Grid>
    </Modal>
  );
};
