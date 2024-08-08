import prisma from "../server/prisma";
import { Request } from "express";
import {  bucket, CloudStorageService } from "../service/cloudStorage";
import { PrismaClient } from "@prisma/client";
type Query = {
  page: string;
  author: string;
  company: string;
  volume: string;
  category: string;
  price: string;
  name: string;
  email: string;
  take: number;
};
class Magazines {
  private handleError() {
  
    throw new Error("Erro: Erro no servidor tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllMagazines(query: Query) {
    const { author, name, company, volume, category, take, page } = query;
    const totalTake = Number(take) || 8;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * totalTake;

    const magazines = await prisma?.magazines.findMany({
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
        volume: {
          contains: (volume as string) || "",
          mode: "insensitive",
        },
        Category: {
          name: {
            contains: category as string,
            mode: "insensitive",
          },
        },
      },
      include: {
        article: true,
        Category: true,
        employees: true,
      },
    });
    const listCount: any = await prisma?.magazines.count({
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
        volume: {
          contains: (volume as string) || "",
          mode: "insensitive",
        },
        Category: {
          name: {
            contains: category as string,
            mode: "insensitive",
          },
        },
      },
    });
    const finalPage = Math.ceil(Number(listCount) / totalTake);

    return { magazines, finalPage };
  }
  async getLastMagazines() {
    const getLastMagazine = await prisma?.magazines.findMany({
      take: 8,
      orderBy: {
        createDate: "asc",
      },
      select: {
        id: true,
        name: true,
        author: true,
        company: true,
        cover: true,
        volume: true,
        description: true,
        model:true
      },
    });

    return getLastMagazine;
  }
  async getMostViews() {
    const mostViewaMagazine = await prisma?.magazines.findMany({
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

    return mostViewaMagazine;
  }
  async getMagazineEdit(slug: string) {
   
    const magazine = await prisma?.magazines.findUnique({
      where: { id: Number(slug) },
      select: {
        author: true,
        Category: true,
        cover: true,
        company: true,
        name: true,
        price: true,
        volume: true,
        id: true,
        subCategory: true,
        description: true,
        magazine_pdf: true,
        employees: true,
        model: true,
      },
    });
    if(!magazine){
        throw new Error("Revista não encontrada")
      }
    const filePath :any= magazine?.magazine_pdf.split("plash_bucket/");
    
    const url = await CloudStorageService.urlFilePublic(filePath[1])
     
   
    
    
    return { magazine, url };
  }
  async getOneMagazinePublic(req: Request) {
    const { slug } = req.params;

    try {
      const magazine = await prisma?.magazines.findUnique({
        where: { id: Number(slug) },
        select: {
          author: true,
          Category: true,
          cover: true,
          company: true,
          name: true,
          views: true,
          price: true,
          volume: true,
          id: true,
          description: true,
          model: true,

          article: {
            take: 6,
            select: {
              author: true,
              company: true,
              description: true,
              name: true,
              views: true,
              cover: true,
              status: true,
              id: true,
            },
          },
        },
      });
      const updateView = await prisma?.magazines.update({
        where: {
          id: Number(slug),
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return magazine;
    } catch (error) {
      console.log(error)
    } 
  }
  // FUnçao responsavel por pegar os dados da revista e criar
  async  performMagazineCreation( magazineData: any,cover_file:any) {
    const { author, company, name, description, categoryId, price, volume, subCategory, model, pdf } = magazineData;
    const slug = `${name}#vol${volume}`;
  
    // Criar a revista no banco de dados
    const createMagazine = await prisma?.magazines.create({
      data: {
        author,
        company,
        name,
        description,
        magazine_pdf: pdf,
        price: Number(price),
        slug: slug,
        subCategory,
        model,
        volume,
        cover: cover_file?.linkUrl,
        categoryId: Number(categoryId),
      },
    });
  
    
  
    return createMagazine?.id;
  }
  //FUnçao responsavel por pegar os dados da revista e e adicionar os colabores nela 
  async addEmployeeMagazine (employee:any,magazine:any){
     
    try {
      const updatePromises = employee.map((employee: any) =>
        prisma?.employee.update({
          where: { id: employee.id },
          data: {
            magazines: {
              connect: { id: magazine },
            },
          },
        })
      );
    
    await Promise.all(updatePromises);
    console.log("criou ")
    return {message:"Criado com sucesos"}
    } catch (error) {
      console.log(error)
      console.log("erro")
    }
     
     
        
      
    
  
   
  }
  // Funçao que criar os dados baseado na revista e colaborador , fazendo dessa forma a performance e melhorada evitando  o delay no banco de dados
  async createMagazine(req: Request) {
    try {
      const magazineData = req.body
      
      const slug = `${magazineData.name}#vol${magazineData.volume}`;
      const employes = JSON.parse(req.body.employes);
  
      const cover_file = req.file as any;
  
      
         await prisma?.$transaction(async (prisma) => {
          
           const id = await this.performMagazineCreation(magazineData,cover_file)
           
          await this.addEmployeeMagazine(employes,id)
        });
 

        return { message: "Revista criada com sucesso!" };
  
        
      
      
       
    
    } catch (error) {
      console.log(error);
      return this?.handleError()
    }
    finally{
      await prisma?.$disconnect()
    }
  }
  
  async updateMagazine(req:Request){
    const { slug} = req.params
  

    if (!slug || slug === "" ) {
      throw new Error ("ID e obrigatorio!")
    }
    //@ts-ignore

    try {
        const {
            author,
            company,
            name,
            description,
            categoryId,
            price,
            volume,
            subCategory,
            model,
            cover,
            pdf,
          } = req.body;
          
          
            const employes = JSON.parse(req.body.employes);
            const slugHash = `${name}#vol${volume}`;
            //@ts-ignore
            const cover_file = req.file as any;
      
            await prisma?.$transaction(async (prisma) => {
              const updateMagazine = await prisma?.magazines.update({
                where: {
                  id: Number(slug),
                },
                data: {
                  author,
                  company,
                  name,
                  description,
                  price: Number(price),
                  volume,
                  subCategory,
                  model,
                  slug: slugHash,
                  categoryId: Number(categoryId),
                  cover: cover_file ? cover_file.linkUrl : cover,
                  magazine_pdf: pdf,
                },
              });
              for (const employee of employes) {
                const updateEmploye = await prisma.employee.update({
                  where: { id: employee.id },
                  data: {
                    magazines: {
                      connect: { id: updateMagazine.id },
                    },
                  },
                });
              }
              return updateMagazine ;
            });
            
    } catch (error) {
        console.error("Erro ao atualizar a revista:", error);
      throw new Error("Erro ao atualizar a revista. Verifique os detalhes e tente novamente.");
    }
  
  
  }
  async deleteEmployeeMagazine(req: Request) {
    const { slug, id } = req.body;
    const deletEmployeeMagazine = await prisma?.magazines.findUnique({
        where: {
          id: Number(slug),
        },
      
      });
   
    try {
        const deletEmployeeMagazine = await prisma?.magazines.update({
            where: {
              id: Number(slug),
            },
            data: {
                employees: {
                  disconnect: {
                    id: Number(id),
                  },
                },
              },
          });
        
      return { message: "Colaborador removido  com sucesso!" };
    } catch (error) {
      console.log(error)
    } 
  }
  async deleteMagazine(req: Request) {
    const {id} = req.body
    try {
      const deletMagazine = await prisma?.magazines.delete({
        where: {
          id: Number(id),
        },
        include: {
          article: true,
          employees: true,
          Category: true,
        },
      });
      return { message: "Categoria deletado com sucesso!" };
    } catch (error) {
      console.log(error)
    } 
  }
}
export const MagazineModel = new Magazines();
