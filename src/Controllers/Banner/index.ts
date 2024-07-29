import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { bucket } from "../../utils/multerConfig";
import BannerModel from "../../models/bannerModels";
class Banner {
   //Funçao para tratar dos erros no servidor
   private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllBanners(req: Request, res: Response) {
    try {
      const banners = await BannerModel.getAllBanners()
  

    return res.status(200).json(banners);
    } catch (error) {
      console.log(error)
      return this?.handleError(error,res)
    }
    
  }
  async createBanner(req: Request, res: Response) {
   
    
 
  
    try {
       const banners = await BannerModel.createBanner(req)
    
     
    return res.status(200).json(banners?.message);
    } catch (error) {
      return this?.handleError(error,res)
    }
    finally{
      return this?.handleDisconnect()
    }
    
  
    
  }
 
 
  async deletBanner(req: Request, res: Response) {
   
    try {
       const banners = await BannerModel.deletBanner(req)
     
      return res.status(200).json({ message: "Banner Deletado com sucesso" });
    } catch (error) {
      return this?.handleError(error,res)
    }
    finally{
      return this?.handleDisconnect()
    }
    
    
  }
  
}
const BannerController = new Banner();
export default BannerController;
