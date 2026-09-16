import { Box, Typography } from "@mui/material";
import bgImage from "../../assets/Designer2.png";
import { memo } from "react";
import { LoginBox } from "../components/styled/LoginBox";

export const AuthLayout = memo(
  ({
    children,
    title,
  }: {
    children: JSX.Element | JSX.Element[];
    title: string;
  }) => {
    return (
      <LoginBox>
        <Box className="imgBx">
          <img src={bgImage} alt="Imagen Fondo" />
        </Box>
        <Box className="contentBx">
          <Box className="formBx">
            <Typography
              textAlign={"center"}
              variant="subtitle1"
              component={"h2"}
            >
              {title}
            </Typography>

            <Box>{children}</Box>
          </Box>
        </Box>
      </LoginBox>
    );
  }
);
