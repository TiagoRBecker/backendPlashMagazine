import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { bucket } from "../../utils/multerConfig";
import SponsorsModel from "../../models/sponsorModel";

class Sponsor {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllSponsorsPublic(req: Request, res: Response) {
    try {
       const sponsors = await SponsorsModel.getAllSponsorsPublic(req)
      return res.status(200).json(sponsors);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  //Retorna todas as categorias
  async getAllSponsors(req: Request, res: Response) {
 
    try {
       const sponsors = await SponsorsModel.getAllSponsors(req)

      return res.status(200).json(sponsors);
    
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async getOneSponsor(req: Request, res: Response) {
    const { slug } = req.params;
    try {
      const sponsor = await SponsorsModel.getOneSponsor(req)
      return res.status(200).json(sponsor);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  //Retorna uma categoria especifica

  //Admin Routes
  async createSponsor(req: Request, res: Response) {
   
    

    try {
      
      const sponsor = await SponsorsModel.createSponsor(req)
      
     
      return res
        .status(200)
        .json({ message: "Patrocinador  criado com sucesso!" });
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  async updateSponsor(req: Request, res: Response) {
    
    try {
   
        const sponsor = await SponsorsModel.updateSponsor(req)
     
        return res
          .status(200)
          .json({ message: "Patrocinador  editado com sucesso!" });
      
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  async deleteSponsor(req: Request, res: Response) {
   
    try {
      const sponsor = await SponsorsModel.deleteSponsor(req)
      return res
        .status(200)
        .json({ message: "Patrocinador deletado com sucesso!" });
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  
}

const SponsorsController = new Sponsor();
export default SponsorsController;
