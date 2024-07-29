import { Response, Request } from "express";
import prisma from "../../server/prisma";
import DvlModel from "../../models/dvlModel";

class DVL {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }

  //Retorna todas as categorias
  async getAllDvls(req: Request, res: Response) {
    try {
      const dvls = await DvlModel.getAllDvls(req);

      return res.status(200).json(dvls);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  async getLastDvls(req: Request, res: Response) {
    try {
      const dvls = await DvlModel.getLastDvls(req);
      return res.status(200).json(dvls);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  //Retorna uma categoria especifica
  async getOneDvl(req: Request, res: Response) {
   
      const { slug } = req.params;
    
    if (!slug) {
      throw new Error("Erro ao encontrar a divisão de lucro!");
    }

    try {
      const dvl = await DvlModel.getOneDvl(req)
      
      return res.json(dvl);
   
    } catch (error) {
       console.log(error)
      return this?.handleError(error, res);
    }
  }

  //Cria uma categoria

  //Atualiza uma categoria especifica
  async updateDvl(req: Request, res: Response) {
    try {
      const updateDvl = await DvlModel.updateDvl(req);
    
      return res.status(200).json(updateDvl);
    } catch (error) {
      return this.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}

const DvlController = new DVL();
export default DvlController;
