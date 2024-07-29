import { Response, Request } from "express";
import prisma from "../server/prisma";

class Article {
  //Funçao para tratar dos erros no servidor
  private handleError() {
  
    throw new Error("Erro: Erro no servidor tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }


  //Retorna um artigo 
  async getOneArticle(req: Request) {
    const { slug } = req.params;
     if(!slug){
      throw new Error ("Artigo não encontrado!")
     }
    try {
      const article = await prisma?.articles.findUnique({
        where: { id: Number(slug) },
        include: {
          magazine: {
            select: {
              id: true,
              name: true,
              company: true,
              cover: true,
              author: true,
            },
          },
        },
      });
      const updateView = await prisma?.articles.update({
        where: {
          id: Number(article?.id),
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return article;
    } catch (error) {
      console.log(error)
      return this?.handleError();
    } finally {
      return this?.handleDisconnect();
    }
  }
  //Retorna os artigos mais visualizados com views de 5  +
  async getArticleMostViews(req: Request) {
    try {
      const mostViewsArticle  = await prisma?.articles.findMany({
   
        where: {
          views: {
            gte: 5,
          },
        },
        select: {
          id: true,
          author: true,
          company: true,
          name: true,
          description: true,
          cover: true,
     
          status: true,
          
          views: true,
        },
      });
    
      return mostViewsArticle;
    } catch (error) {
       console.log(error)
      return this?.handleError();
    } finally {
       await this?.handleDisconnect();
    }
  }
  //Retorna os artigos recomendados
  async getArticleRecommended(req: Request) {
    try {
      const recommendedArticle = await prisma?.articles.findMany({
        where: {
          status: "recommended",
        },
        select: {
          id: true,
          author: true,
          company: true,
          name: true,
          description: true,
          cover: true,
       
          status: true,
      
          views: true,
        },
      });

      return recommendedArticle;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna os artigos gratuitos
  async getArticleFree(req: Request) {
    try {
      const freeArticle = await prisma?.articles.findMany({
        where: {
          status: "free",
        },
        select: {
          id: true,
          author: true,
          company: true,
          views: true,
          name: true,
          description: true,
          cover: true,
       
          status: true,
       
     
          magazine: true,
        },
      });

      return freeArticle ;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna os artigos tendencias
  async getArticleTrend(req: Request, res: Response) {
    try {
      const trendArticles = await prisma?.articles.findMany({
        where: {
          status: "trend",
        },
        select: {
          id: true,
          author: true,
          company: true,
          name: true,
          description: true,
          cover: true,
       
          status: true,
        
          views: true,
        },
      });

      return trendArticles;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna e os mais lidos
  async getArticleMostRead(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.articles.findMany({
        where: {
          views: {
            gte: 5,
          },
        },
        select: {
          id: true,
          author: true,
          company: true,
          name: true,
          description: true,
          cover: true,
       
          status: true,
         
          views: true,
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
}
class AdminArticle {
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
  async getAllArticle(req: Request) {
    try {
      const { author, name, company, volume, category, take, page } = req.query;
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;

      const articles = await prisma?.articles.findMany({
        take: totalTake,
        skip: skip,
        where: {
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
          author: {
            contains: (author as string) || "",
            mode: "insensitive",
          },
          company: {
            contains: (company as string) || "",
            mode: "insensitive",
          },

          categories: {
            name: {
              contains: category as string,
              mode: "insensitive",
            },
          },
        },
        include: {
          magazine: true,
          categories: true,
        },
      });
      const listCount: any = await prisma?.articles.count();
      const finalPage = Math.ceil(listCount / totalTake);

      return { articles, finalPage };
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar artigos ");
    } finally {
      await this?.handleDisconnect()
    } 
  }

  //Retorna uma categoria especifica
  async getOneArticle(req: Request) {
    const { slug } = req.params;

    try {
      const getArticle = await prisma?.articles.findUnique({
        where: { id: Number(slug) },
      });
      if (!getArticle) {
        throw new Error("Artigo não encontrado");
      }
      return getArticle;
    } catch (error) {
      throw new Error("Erro ao encontrar artigo tente novamente mais tarde!");
    } finally {
     await this?.handleDisconnect();
    }
  }
  async getArticleMostViews(req: Request, res: Response) {
    try {
      const getArticle = await prisma?.articles.findMany({
        take: 6,
        where: {
          views: {
            gte: 10,
          },
        },
        select: {
          id: true,
          author: true,
          company: true,
          name: true,
          description: true,
          cover: true,
         
          status: true,
         
          views: true,
        },
      });

      return res.status(200).json(getArticle);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      await this?.handleDisconnect();
    }
  }

 

  //Admin Routes
  async createArticle(req: Request) {
    const {
      author,
      company,
      name,
      description,

      categoryId,
      magazineId,
    
      status,
    } = req.body;

    const file = req.file as any;

    try {
      const createArticle = await prisma?.articles.create({
        data: {
          author,
          company,
          name,
          description,
          cover: file.linkUrl,
          magazineId: Number(magazineId),
          categoriesId: Number(categoryId),
          status: status,
         
        },
      });
      return { message: " Artigo criado com sucesso!" };
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao criar o artigo tente novamente!");
    } finally {
      await this?.handleDisconnect();
    }
  }

  async updateArticle(req: Request) {
    const { slug } = req.params;
    if (!slug) {
      throw new Error("Slug é obrigatório!");
    }
    const {
      author,
      company,
      name,
      description,

      categoryId,
      magazineId,
      status,
      cover,
    } = req.body;
    const newCover = req.file as any;

    //@ts-ignore

    try {
      const updateArticle = await prisma?.articles.update({
        where: {
          id: Number(slug),
        },
        data: {
          author,
          company,
          name,
          description,

          categoriesId: Number(categoryId),
          magazineId: Number(magazineId),
          status,
          cover: newCover ? newCover.linkUrl : cover,
        },
      });
      return { message: "Artigo atualizada com sucesso!" };
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao atualizar o artigo");
    } finally {
      await this?.handleDisconnect();
    }
  }

  async deleteArticle(req: Request) {
    const { id } = req.body;
    if (!id) {
      throw new Error("ID obrigatório!");
    }
    try {
      const deletMagazine  = await prisma?.articles.delete({
        where: {
          id: Number(id),
        },
      });
      return { message: "Artigo deletado com sucesso!" };
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao deletar o artigo tente novamente mais tarde !");
    } finally {
      await this?.handleDisconnect();
    }
  }
}

export const PublicArticleModel = new Article();
export const AdminArticleModel = new AdminArticle();
