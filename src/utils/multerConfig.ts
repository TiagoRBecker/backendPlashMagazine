
import Multer from "multer";
import path from "path";

const { Storage } = require("@google-cloud/storage");
import MulterGoogleCloudStorage from "multer-cloud-storage";
const credentials = JSON.stringify(process.env.CRED)
export const storage = new Storage({
  //Troque para o seu arquivo de credenciais google
  keyFilename: credentials,
});
export const bucket = storage.bucket("plash_bucket");
export const bucketPublic = storage.bucket("public-plash-bucket")
export const GCLOUD = Multer({
  storage: new MulterGoogleCloudStorage({
    bucket: "plash_bucket",
    projectId: 'lithe-lens-423414-q6',
    keyFilename: credentials,
    
  }),
});
export const upload = Multer({
  storage: new MulterGoogleCloudStorage({
    bucket: "public-plash-bucket",
    projectId: 'lithe-lens-423414-q6',
    keyFilename: credentials,
    acl: 'publicRead', // Define os arquivos como publicamente legíveis
    
    filename: (req:any, file:any, cb:any) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
});