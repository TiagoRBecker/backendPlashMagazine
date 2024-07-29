import { Response, Request } from "express";

import { CloudStorageService } from "../../service/cloudStorage";
export const UploadPdf = async (req:Request,res:Response)=>{
     const pdf = req.file as any
    try {
         const link = pdf.linkUrl.split("plash_bucket/")
         
          const url = await CloudStorageService.urlFilePublic(link[1])
          
        return res.status(200).json({pdf:pdf.linkUrl, url:url})
       
    } catch (error) {
        console.log(error)
    }
     

}