import { Response, Request } from "express";
import prisma from "../server/prisma";

class Banner {
   //Funçao para tratar dos erros no servidor
   private handleError() {
    
    throw new Error ("Error: Erro interno no sistema tente novamente mais tarde");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  //Retorna os banners
  async getAllBanners() {
    try {
      const banners = await prisma?.banners.findMany({
        take:4
    });

    return banners;
    } catch (error) {
      console.log(error)
      return this?.handleError()
    }finally{
      await this?.handleDisconnect()
    }
    
  }
  // Cria um banner para ser usado no carrosel no front end
  async createBanner(req: Request) {
    const { name} = req.body
    const banner = req.file as any
    
 
  
    try {
      const createBanner = await prisma?.banners.create({
        data:{
            name,
            cover:banner.linkUrl
        }
    });
     
    return {message:"Banner criado com sucesso"};
    } catch (error) {
      return this?.handleError()
    }
    finally{
      await this?.handleDisconnect()
    }
    
  
    
  }
 
   //Deleta o Banner do DB
 
  async deletBanner(req: Request) {
    const {id} = req.body
    
  
    if(!id){
      throw new Error("Banner não encontrado!")
    }
    try {
      const deleteBanner = await prisma?.banners.delete({
        where:{
          id:Number(id)
        }
      });
     
      return { message: "Banner Deletado com sucesso" };
    } catch (error) {
        console.log(error)
      return this?.handleError()
    }
    finally{
       this?.handleDisconnect()
    }
    
    
  }
  
}
const BannerModel = new Banner();
export default BannerModel;