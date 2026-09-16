import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

export const Alerta = () => {
  return (
    <>
      {/* asdsad
      <IconButton
        aria-label=""
        onClick={() => {
          toast.error(
            <Confirm
              titulo="Probando"
              actions={[
                {
                  color: "error",
                  Icon: Check,
                  name: "Si",
                  onClick() { 
                  },
                  size: "small",
                  tipo: "boton",
                },
              ]}
            />
          );
        }}
      >
        <NotificationAdd />
      </IconButton> */}
      {/* <ToastContainer
        containerId={"confirm"}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        limit={1}
      /> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

// import { Box, Typography } from "@mui/material";
// import { Acciones } from "..";
// import { Action } from "../../../interfaces/global";
// import { ToastPosition } from "react-toastify";

// interface confirmConfigurationProperties {
//   autoClose: number | false | undefined;
//   position: ToastPosition | undefined;
//   containerId: string;
// }
// export const confirmConfiguration: confirmConfigurationProperties = {
//   autoClose: undefined,
//   position: "top-center",
//   containerId: "confirm",
// };
// export const Confirm = ({
//   titulo,
//   actions,
// }: {
//   titulo: string;
//   actions: Action[];
// }) => {
//   return (
//     <Box
//       display={"flex"}
//       justifyContent={"space-between"}
//       alignItems={"center"}
//     >
//       <Typography variant="subtitle2">{titulo}</Typography>
//       <Acciones actions={actions} />
//     </Box>
//   );
// };
