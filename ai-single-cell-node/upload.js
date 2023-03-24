const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const fs = require('fs-extra');
const storageConfig = JSON.parse(fs.readFileSync('./configs/storageConfig.json'));
const storageDir = storageConfig.storageDir;

const username = 'saketh.p';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  `${storageDir}/${username}/${req.query.uploadDir}`);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array("files", 10);

let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
