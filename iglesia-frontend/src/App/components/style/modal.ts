import { Box, Theme, Typography, styled } from "@mui/material";

export const StyledModalBoxHeader = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  })
);

export const StyledTypographyHeader = styled(Typography)(
  ({ theme }: { theme: Theme }) => ({
    fontSize: "1.5rem",
    textTransform: "uppercase",
    fontStyle: "italic",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  })
);

export const StyledContainerForm = styled(Box)<{
  height: {
    xs: string;
    md: string;
    lg: string;
  };
  header_height: number;
  footer_height: number;
}>(({ height: { lg, md, xs }, header_height, footer_height, theme }) => ({
  [theme.breakpoints.up("xs")]: {
    height: `calc(${xs}vh - ${footer_height + header_height}px)`,
  },
  [theme.breakpoints.up("md")]: {
    height: `calc(${md}vh - ${footer_height + header_height}px)`,
  },
  [theme.breakpoints.up("lg")]: {
    height: `calc(${lg}vh - ${footer_height + header_height}px)`,
  },
  padding: theme.spacing(1),
  overflow: "auto",
}));

export const StyledGridContainer = styled(Box)<{
  xs?: number;
  md?: number;
  lg?: number;
}>(({ xs = 1, md = 2, lg = 2, theme }) => ({
  display: "grid",
  columnGap: theme.spacing(0.5),
  rowGap: theme.spacing(1),
  [theme.breakpoints.up("xs")]: {
    gridTemplateColumns: `repeat(${xs}, 1fr)`,
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: `repeat(${md}, 1fr)`,
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: `repeat(${lg}, 1fr)`,
  },

  "& .fullWidth": {
    rowGap: theme.spacing(5),

    gridColumn: "1 / -1",
  },
}));

export const StyledModalBoxFooter = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    borderTop: `1px solid ${theme.palette.primary.main}`,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  })
);

export const StyledTypographyFooter = styled(Typography)({
  textTransform: "uppercase",
  fontWeight: "bold",
  fontSize: "0.75rem",
  "& span": {
    fontSize: "0.75rem",
  },
});

export const StyledTypographyFooterSpan = styled(Typography)({
  textTransform: "uppercase",
  fontWeight: "bold",
});
