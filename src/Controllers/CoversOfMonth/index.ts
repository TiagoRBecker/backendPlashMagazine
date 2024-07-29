import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { randomUUID } from "crypto";
import { AdminCoversModel, PublicCoversModel } from "../../models/coversModel";
class Covers {
   //Funçao para tratar dos erros no servidor
   private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllCoverEvents(req: Request, res: Response) {
    try {
       
      const covers = await PublicCoversModel.getAllCoverEvents(req)
  
      return res.status(200).json(covers);
    } catch (error:any) {
      console.log(error)
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async getAllCoverEventsAdmin(req: Request, res: Response) {
   
    try {
      const covers = await AdminCoversModel.getAllCoverEventsAdmin(req)
   
    return res.status(200).json(covers);
    } catch (error:any) {
       console.log(error)
       return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
   
       
  }
  async addVoteCover(req: Request, res: Response) {
   
    try {
      const covers = await PublicCoversModel.addVoteCover(req)

      return res.status(200).json({ message: "Voto confirmado com sucesso " });
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
    finally{
      return this?.handleDisconnect()
    }
  }
  async createEventCover(req: Request, res: Response) {

  try {
      const covers = await AdminCoversModel.createEventCover(req)
      return res.status(200).json({ message: "Evento criado com sucesso" });
      
    ;
  } catch (error:any) {
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
 
    
    
  }

  async deletEvent(req: Request, res: Response) {
   
    
    
    try {
      const covers = await AdminCoversModel.deletEvent(req)
  

      return res.status(200).json({ message: "Evento Deletado com sucesso" });
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
}
const CoversController = new Covers();
export default CoversController;
