const multer = require("multer");
const uuid = require("uuid-v4");

//fileUpload is a group of middleware
const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/bmp": "bmp",
};

const fileUpload = multer({
  limits: 500000, //bytes
  storage: multer.diskStorage({
    //cd -> callback
    destination: (req, file, cb) => {
      cb(null, "uploads"); //the destination where the image will be save
    },
    filename: (req, file, cb) => {
      //mimetype give the extensions of MIME_TYPE_MAP like ('image/png' : 'png') and all others
      const ext = MIME_TYPE_MAP[file.mimetype]; //get png,jpeg,jpg
      cb(null, uuid() + "." + ext);
    },
  }),
  //filter all file that are not png,jpeg,jpg
  fileFilter: (req, file, cb) => {
    //with !! we convert undefined or false to other mimetype, and png,jpeg,jpg we convert to true
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // true or false is the result
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
