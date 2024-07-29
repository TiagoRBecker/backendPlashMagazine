import { Response, Request } from "express";
import prisma from "../server/prisma";
class PublicCovers {
   //Funçao para tratar dos erros no servidor
   private handleError() {
    throw new Error ("Error: Erro no sistema tente novamente mais tarde!")
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
     await prisma?.$disconnect();
  }
  async getAllCoverEvents(req: Request) {
    try {
      
      const covers = await prisma?.eventOfCoverMonth.findMany({
        take:1,
        include: {
          cover: true,
        },
      });
  
      return covers;
    } catch (error) {
      console.log(error)
      return this?.handleError()
    }finally{
      await this?.handleDisconnect()
    }
  }
 
  async addVoteCover(req: Request) {
    const { slug } = req.params;
    const id = req.user.id;

    const checkUser = await prisma?.coverOfMonth.findFirst({
      where: {
        id: Number(slug),
        userId: Number(id),
      },
    });

    if (checkUser) {
      throw new Error ("Ops! Seu voto já foi  inserido á esta capa!")
    }
    try {
      const covers = await prisma?.coverOfMonth.update({
        where: {
          id: Number(slug),
        },
        data: {
          countLike: {
            increment: 1,
          },
          userId: Number(id),
        },
      });

      return{ message: "Voto confirmado com sucesso " };
    } catch (error) {
      console.log(error);
      return this?.handleError()
    }
    finally{
      await this?.handleDisconnect()
    }
  }
 

 
}
class AdminCovers {
    //Funçao para tratar dos erros no servidor
    private handleError() {
        throw new Error ("Error: Erro no sistema tente novamente mais tarde!")
      }
      //Função para desconetar o orm prisma
      private async handleDisconnect() {
         await prisma?.$disconnect();
      }

   async getAllCoverEventsAdmin(req: Request) {
     const {page, take,name} = req.query;
     try {
       const totalTake = Number(take) || 8; 
       const currentPage = Number(page) || 1; 
       const skip = (currentPage - 1) * totalTake;
     const covers = await prisma?.eventOfCoverMonth.findMany({
      take:totalTake,
      skip:skip,
      where:{
       name:{
         contains:name as string || '',
         mode:"insensitive"
       }
      },
      include: {
       cover: true,
     }
     });
     const listCount = await prisma?.eventOfCoverMonth.count();
     const finalPage = Math.ceil(Number(listCount) / totalTake);
     return{covers:covers,total:finalPage};
     } catch (error) {
        console.log(error)
       return this?.handleError()
     }
     finally{
       await this?.handleDisconnect()
     }
        
   }
  
   async createEventCover(req: Request) {
     const { data, date_event, selectedValues } = req.body;
   try {
     await prisma?.$transaction(async (prisma) => {
       const ids = selectedValues.map((id: any) => parseInt(id));
       const getCovers = await prisma.magazines.findMany({
         where: {
           id: {
             in: ids,
           },
         },
         select: {
           id: true,
           name: true,
           cover: true,
         },
       });
   
     
       let covers = [] as any;
       for (const cover of getCovers) {
         covers.push({ name: cover.name, cover: cover.cover });
       }
 
       const createEvent = await prisma.eventOfCoverMonth.create({
         data: {
           name:data.name,
           description:data.desc,
           date_event: String(date_event),
           cover: {
             create: covers,
           },
         },
       });
 
       return { message: "Evento criado com sucesso" };
       
     });
   } catch (error) {
     console.log(error);
      return this?.handleError()
   }
   finally{
     await this?.handleDisconnect()
   }
     
     
   }
 
   async deletEvent(req: Request) {
     const { slug } = req.params;
     
     if (!slug) {
       throw new Error("Evento não encontrado!")
     }
     try {
        const deletCover = await prisma?.eventOfCoverMonth.delete({
            where: {
              id: Number(slug),
            },
            include:{
              cover:true
            }
          });
          return { message: "Evento Deletado com sucesso" };
     } catch (error) {
        console.log(error)
        return this?.handleError()
     }
     finally{
       await this?.handleDisconnect()
     }
     

 }
}
export const PublicCoversModel = new PublicCovers();
export const AdminCoversModel = new AdminCovers()
