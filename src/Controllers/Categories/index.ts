import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { AdminCategorieModel, PublicCategorieModel } from "../../models/categoriesModel";

class Categories {
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
  async getAllCategories(req: Request, res: Response) {
    try {
     const categories = await PublicCategorieModel.getAllCategories(req)

      return res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneCategory(req: Request, res: Response) {
  

    try {
       const category = await PublicCategorieModel.getOneCategory(req)

      return res.status(200).json(category);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  
}
class AdminCategories {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    await prisma?.$disconnect();
  }
  //Retorna todas as categorias
  async getAllCategories(req: Request, res: Response) {
    try {
       const categories = await AdminCategorieModel.getAllCategories(req)

      return res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } 
  }
  //Retorna uma categoria especifica
  async getOneCategory(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const category = await AdminCategorieModel.getOneCategory(req)

      return res.status(200).json(category);
    } catch (error) {
       console.log(error)
      return this?.handleError(error, res);
    } 
  }

  //Cria uma categoria
  async createCategory(req: Request, res: Response) {
    
    try {
      const createCategory = await AdminCategorieModel.createCategory(req)
      return res.status(200).json(createCategory.message);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } 
  }
  //Atualiza uma categoria especifica
  async updateCategory(req: Request, res: Response) {
  

    
    try {
      const updateCategory = await AdminCategorieModel.updateCategory(req)
      return res
        .status(200)
        .json(updateCategory.message);
    } catch (error) {
      return this.handleError(error, res);
    } 
  }
  //Delete uma categoria especifica
  async deleteCategory(req: Request, res: Response) {
    
    try {
      const deleteCategory = await AdminCategorieModel.deleteCategory(req)
      return res
        .status(200)
        .json(deleteCategory.message);
    } catch (error) {
      return this?.handleError(error, res);
    } 
  }
}

export const CategoriesController = new Categories();
export const  AdminCategoriesController = new AdminCategories();
