import { response } from "express";
import { UsuarioModel } from "../models";
import bcryptjs from "bcryptjs";
import { deleteFileLocal, generarJwt, usuarioProps } from "../helpers";
import { LogoModel } from "../models/Logo";

export const createUsuario = async (req, res = response) => {
  try {
    const usuario = new UsuarioModel(req.body);

    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password, salt);
    await usuario.save();

    //TODO: GENERAR JWT
    const token = await generarJwt(usuario.id);
    res.status(201).json({
      ...usuarioProps(usuario),
      token,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al crear el usuario",
    });
  }
};

export const loginUsuario = async (req, res = response) => {
  const { username, password } = req.body;
  try {
    const usuario = await UsuarioModel.findOne({ username });
    if (!usuario) {
      return res.status(400).json({
        error: true,
        msg: "El usuario no existe",
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        error: true,
        msg: "El usuario esta inactivo",
      });
    }
    // MATCH PASSWORD

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        error: true,
        msg: "Contraseña incorrecta",
      });
    }
    //TODO: GENERAR JWT
    const token = await generarJwt(usuario.id);
    const logo = await LogoModel.find();

    res.json({
      ...usuarioProps(usuario),
      token,
      logo: logo.length > 0 ? logo[0].url : "",
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al loguearse",
    });
  }
};

export const renewToken = async (req, res = response) => {
  try {
    const { uid } = req;
    //TODO: GENERAR JWT
    const token = await generarJwt(uid);
    let usuario = await UsuarioModel.findOne({ _id: uid });
    if (!usuario.estado) {
      return res.status(401).json({
        error: true,
        msg: "El usuario esta inactivo",
      });
    }
    const logo = await LogoModel.find();

    res.json({
      ...usuarioProps(usuario),
      token,
      logo: logo.length > 0 ? logo[0].url : "",
    });
  } catch (error) {
    console.log({ error });
    res.json({
      error: true,
      msg: String(error) || "Error al generar token",
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  const { data, eliminados } = req.body;

  try {
    eliminados.forEach(async (element) => {
      await deleteFileLocal(element);
    });

    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    const password =
      data.newPassword === ""
        ? data.password
        : bcryptjs.hashSync(data.newPassword, salt);
    await UsuarioModel.findOneAndUpdate(
      { _id: data.uid },
      { ...data, password },
    );
    const logoitem = await LogoModel.find();
    if (logoitem.length === 0) {
      new LogoModel({
        url: data.logo,
      }).save();
    } else {
      await logoitem[0].updateOne({
        url: data.logo,
      });
    }
    return res.status(200).json({
      error: false,
      msg: "Actualizado con exito",
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      error: true,
      msg: String(error) || "Hubo un error al actualizar el usuario",
    });
  }
};
