
import Multer from "multer";
import path from "path";

const { Storage } = require("@google-cloud/storage");
const keyFilenamePath = path.resolve(__dirname, "./cloud.json");

import MulterGoogleCloudStorage from "multer-cloud-storage";

export const storage = new Storage({
  //Troque para o seu arquivo de credenciais google
  keyFilename: keyFilenamePath,
});
export const bucket = storage.bucket("plash_bucket");
export const bucketPublic = storage.bucket("public-plash-bucket")
export const GCLOUD = Multer({
  storage: new MulterGoogleCloudStorage({
    bucket: "plash_bucket",
    projectId: 'lithe-lens-423414-q6',
    keyFilename: keyFilenamePath,
    
  }),
});
export const upload = Multer({
  storage: new MulterGoogleCloudStorage({
    bucket: "public-plash-bucket",
    projectId: 'lithe-lens-423414-q6',
    keyFilename: keyFilenamePath,
    acl: 'publicRead', // Define os arquivos como publicamente legíveis
    
    filename: (req:any, file:any, cb:any) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
});