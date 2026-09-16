import { multerConfig } from "../helpers/multer";

export const uploadSingle = (field = "file") => {
  return (req, res, next) => {
    const handler = multerConfig.single(field);
    handler(req, res, function (err) {
      if (err) {
        console.log({ err });

        return res.status(400).json({ ok: false, msg: err.message });
      }
      next();
    });
  };
};

export const uploadArray = (field = "files", maxCount = 5) => {
  return (req, res, next) => {
    const handler = multerConfig.array(field, maxCount);
    handler(req, res, function (err) {
      if (err) {
        return res.status(400).json({ ok: false, msg: err.message });
      }
      next();
    });
  };
};
