import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { bucket } from "../../utils/multerConfig";
import { AdminArticleModel,PublicArticleModel } from "../../models/articleModel";

class Article {
  //Funçao para tratar dos erros no servidor
  private handleError() {
    
    throw new Error ("Error: Erro interno no servidor tente novamente mais tarde") ;
  }
  
 

 

 
  async getOneArticlePublic(req: Request,res:Response) {
  

    try {
       const articles = await PublicArticleModel.getOneArticle(req)

      return res.status(200).json(articles)
    } catch (error) {
       console.log(error)
      return this?.handleError();
    } 
  }

  async getArticleMostViews(req: Request, res: Response) {
    try {
      const mostViews = await PublicArticleModel.getArticleMostViews(req)
     
      return res.status(200).json(mostViews);
    } catch (error) {
       console.log(error)
      return this?.handleError();
    } 
  }
  async getArticleRecommended(req: Request, res: Response) {
    try {
      const recommendedArticle = await PublicArticleModel.getArticleRecommended(req)

      return res.status(200).json(recommendedArticle);
    } catch (error) {
      return this?.handleError();
    } 
  }
  async getArticleFree(req: Request, res: Response) {
    try {
      const freeArticle= await PublicArticleModel.getArticleFree(req)
    
      return res.status(200).json(freeArticle) ;
    } catch (error) {
      return this?.handleError();
    } 
  }
  async getArticleTrend(req: Request, res: Response) {
    try {
      const trendArticles = await PublicArticleModel.getArticleFree(req)

      return res.status(200).json(trendArticles);
    } catch (error) {
      return this?.handleError();
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
  async getAllArticle(req: Request, res: Response) {
    try {
      const articles = await AdminArticleModel.getAllArticle(req);

      return res.status(200).json(articles);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } 
  }

  //Retorna uma categoria especifica
  async getOneArticle(req: Request, res: Response) {
    try {
      const article = await AdminArticleModel.getOneArticle(req);

      return res.status(200).json(article);
    } catch (error) {
      return this?.handleError(error, res);
    } 
  }
 

  
  //Admin Routes
  async createArticle(req: Request, res: Response) {
    try {
      const create = await AdminArticleModel.createArticle(req);
      return res.status(200).json(create);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } 
  }

  async updateArticle(req: Request, res: Response) {
    try {
      const articleUpdate = await AdminArticleModel.updateArticle(req);
      return res.status(200).json(articleUpdate);
    } catch (error) {
      console.log(error);
      return this.handleError(error, res);
    } 
  }

  async deleteArticle(req: Request, res: Response) {
    try {
      const article :any = await AdminArticleModel.deleteArticle(req);
      return res.status(200).json(article.message);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } 
  }
}

export const ArticleController = new Article();
export const AdminArticleController = new AdminArticle();
