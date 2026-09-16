import jwt from "jsonwebtoken";
export const generarJwt = (uid) => {
  return new Promise((res, rej) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (error, token) => {
        if (error) {
          console.log({ error });
          rej("No se pudo generar el token");
        }
        res(token);
      }
    );
  });
};

export const comprobarJWT = (token) => {
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    return { uid };
  } catch (error) {
    console.log({ error });
    return { error: true, uid: null };
  }
};
