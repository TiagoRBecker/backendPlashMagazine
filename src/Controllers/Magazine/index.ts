import { Response, Request } from "express";
import prisma from "../../server/prisma";

import { bucket } from "../../utils/multerConfig";
import { MagazineModel } from "../../models/magazineModel";

class Magazine {
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
  async getAllMagazine(req: Request, res: Response) {
    const query = req.query;
    try {
      const magazines = await MagazineModel.getAllMagazines(query as any);
      return res.status(200).json(magazines);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getLastMagazines(req: Request, res: Response) {
    try {
      const getLastMagazine = await MagazineModel.getLastMagazines();

      return res.status(200).json(getLastMagazine);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getMostViews(req: Request, res: Response) {
    try {
      const getLastMagazine = await prisma?.magazines.findMany({
        take: 4,
        orderBy: {
          createDate: "asc",
        },
        where: {
          view: {
            gte: 2,
          },
        },
        select: {
          id: true,
          name: true,
          author: true,
          company: true,
          cover: true,
          volume: true,
          view: true,
        },
      });

      return res.status(200).json(getLastMagazine);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneMagazine(req: Request, res: Response) {
    try {
      const magazine = await MagazineModel.getOneMagazinePublic(req);

      return res.status(200).json(magazine);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}

class AdminMagazine {
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
  async getAllMagazine(req: Request, res: Response) {
    const query = req.query;
    try {
      const magazines = await MagazineModel.getAllMagazines(query as any);
      return res.status(200).json(magazines);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  async getMostViews(req: Request, res: Response) {
    try {
      const getLastMagazine = await MagazineModel.getMostViews();

      return res.status(200).json(getLastMagazine);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica

  //Admin Routes
  async getMagazineEdit(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const magazine = await MagazineModel.getMagazineEdit(slug);
      //@ts-ignore

      return res.status(200).json(magazine);
    } catch (error: any) {
      console.log(error);
      return res
        .status(404)
        .json({ message: error.message || "Erro desconhecido" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  async createMagazine(req: Request, res: Response) {
    try {
      const magazine = await MagazineModel.createMagazine(req);
      return res.status(200).json(magazine);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateMagazine(req: Request, res: Response) {
    try {
      const updateMagazine = await MagazineModel.updateMagazine(req);

      return res
        .status(200)
        .json({ message: "Revista atualizada com sucesso!" });
    } catch (error: any) {
      console.log(error);
      return res
        .status(404)
        .json({ message: error.message || "Erro desconhecido" });
    } finally {
      return this?.handleDisconnect();
    }
  }

  async deleteEmployeeMagazine(req: Request, res: Response) {
    try {
      const removeEmployee = await MagazineModel.deleteEmployeeMagazine(req);
      return res
        .status(200)
        .json({ message: "Colaborador removido  com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async deleteMagazine(req: Request, res: Response) {
    if (!req.body.id) {
      throw new Error("Revista não encontrada!");
    }
    try {
      const deleteMagazine = await MagazineModel.deleteMagazine(req);
      return res.status(200).json({ message: "Revista deletada com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}
export const AdminMagazineController = new AdminMagazine();
export const MagazineController = new Magazine();
