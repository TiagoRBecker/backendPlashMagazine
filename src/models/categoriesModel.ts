import { Response, Request } from "express";
import prisma from "../server/prisma";

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
  async getAllCategories(req: Request) {
    try {
      const categories = await prisma?.categories.findMany({
       select:{
        id:true,
        name:true,
        magazine:{
            select:{
                id:true,
                author:true,
                company:true,
                model:true,
                cover:true,
                slug:true,
                name:true,
                volume:true,
                views:true,
                price:true,
                description:true,

            }
        }
       }
      });

      return categories;
    } catch (error) {
      console.log(error);
      throw new Error ("Erro ao buscar as categorias !");
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneCategory(req: Request) {
    const { slug } = req.params;
     if(!slug){
        throw new Error("Categoria não encontrada!")
     }
    try {
      const category = await prisma?.categories.findUnique({
        where: { id: Number(slug) },
        include: {
          magazine: {
            select: {
              author: true,
              Category: true,
              cover: true,
              company: true,
              name: true,
              price: true,
              volume: true,
              id: true,
              description:true,
              model:true,
              article:true,

            },
          },
        },
      });

      return category;
    } catch (error) {
     console.log(error);
     throw new Error ("Erro ao buscar a categoria !");
    } finally {
      await this?.handleDisconnect();
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
  async getAllCategories(req: Request) {
    try {
      const categories = await prisma?.categories.findMany({
         include:{
         
          magazine:true,
         }
      });

      return categories;
    } catch (error) {
      console.log(error);
      throw new Error ("Erro ao buscar as categorias !");
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica
  async getOneCategory(req: Request) {
    const { slug } = req.params;
    if(!slug){
        throw new Error ("Erro ao buscar os dados da categoria!")
    }
    try {
      const categoryOne = await prisma?.categories.findUnique({
        where: { id: Number(slug) },
        include: {
          magazine: {
            select: {
              author: true,
              Category: true,
              cover: true,
              company: true,
              name: true,
              price: true,
              volume: true,
              id: true,
              description:true,
              model:true
            },
          },
        },
      });

      return categoryOne;
    } catch (error) {
         throw new Error ("Erro ao encontrar a categoria");
    } finally {
      await this?.handleDisconnect();
    }
  }

  //Cria uma categoria
  async createCategory(req: Request) {
    const { category } = req.body;
    if(!category){
        throw new Error ("Necessário preencher o campo categoria !")
    }
    try {
      const createMagazine = await prisma?.categories.create({
        data: {
          name: category,
        },
      });
      return { message: "Categoria criada com sucesso!" };
    } catch (error) {
      console.log(error);
      throw new Error ("Erro ao criar  a categoria")
    } finally {
    await this?.handleDisconnect()
    }
  }
  //Atualiza uma categoria especifica
  async updateCategory(req: Request) {
    const { slug, editCategory } = req.body;

    if (!slug) {
       throw new Error ("Erro ao encontrar a cateoria ")
    }
    try {
      const updateCategory = await prisma?.categories.update({
        where: {
          id: Number(slug),
        },
        data: {
          name: editCategory,
        },
      });
      return { message: "Categoria atualizada com sucesso!" };
    } catch (error) {
      console.error(error);
      throw new Error ("Erro aoatualizar a categoria")
    } finally {
     await this?.handleDisconnect()
    }
  }
  //Delete uma categoria especifica
  async deleteCategory(req: Request) {
    const { id } = req.body;
    if(!id){
        throw new Error ("Erro ao encontrar a categoria")
    }
   
    try {
      const deletCategory = await prisma?.categories.delete({
        where: {
          id: Number(id),
        },
      });
      return { message: "Categoria deletado com sucesso!" };
    } catch (error) {
      throw new Error ("Erro ao deletar a categoria tente novamente mais tarde!")
    } finally {
      await this?.handleDisconnect()
    }
  }
}

export const PublicCategorieModel = new Categories();
export const  AdminCategorieModel = new AdminCategories();
