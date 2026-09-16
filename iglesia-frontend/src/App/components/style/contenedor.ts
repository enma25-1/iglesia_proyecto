import { Box, styled } from "@mui/material";

export const PaperContainerPage = styled(Box)(() => {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // overflow: "auto",
    // position: "relative",
    ".tablePagination": { minHeight: "52px" },
  };
});
// export const PaperContainerPage = styled(Paper)(
//   ({ theme }: { theme: Theme }) => ({
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     zIndex: -1,
//     // overflow: "auto",
//     // position: "relative",
//   })
// );
