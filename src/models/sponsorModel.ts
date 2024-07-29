import { Response, Request } from "express";
import prisma from "../server/prisma";


class Sponsor {
  //Funçao para tratar dos erros no servidor
  private handleError(error:any) {
    console.error(error);
    throw new Error("Error: Erro no sistema tente novamente mais tarde !")
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    await prisma?.$disconnect();
  }
  async getAllSponsorsPublic(req: Request) {
    try {
      const sponsors = await prisma?.sponsors.findMany({
        select: {
          company: true,
          url: true,
          cover: true,
        },
      });
      return sponsors;
    } catch (error) {
      console.log(error);
      return this?.handleError(error);
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna todas as categorias
  async getAllSponsors(req: Request) {
    const { name, email, page, take, company, phone } = req.query;
    try {
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;
      const sponsors = await prisma?.sponsors.findMany({
        take: totalTake,
        skip,
        where: {
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
          email: {
            contains: (email as string) || "",
            mode: "insensitive",
          },
          company: {
            contains: (company as string) || "",
            mode: "insensitive",
          },
          phone: {
            contains: (phone as string) || "",
            mode: "insensitive",
          },
        },
      });

      const listCount = await prisma?.sponsors.count({
        where: {
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
          email: {
            contains: (email as string) || "",
            mode: "insensitive",
          },
          company: {
            contains: (company as string) || "",
            mode: "insensitive",
          },
          phone: {
            contains: (phone as string) || "",
            mode: "insensitive",
          },
        },
      });
      const finalPage = Math.ceil(Number(listCount) / totalTake);

      return { sponsors, finalPage };
    
    } catch (error) {
      console.log(error);
      return this?.handleError(error);
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getOneSponsor(req: Request) {
    const { slug } = req.params;
    try {
      const sponsor = await prisma?.sponsors.findUnique({
        where: { id: Number(slug) },
      });
      return sponsor;
    } catch (error) {
      return this?.handleError(error);
    } finally {
      await  this?.handleDisconnect();
    }
  }
  //Retorna uma categoria especifica

  //Admin Routes
  async createSponsor(req: Request) {
    const { name, url, email, phone, company } = req.body;

    const cover = req.file as any;
    const checkingSponsors = await prisma?.sponsors.findUnique({
      where: {
        email: email,
      },
    });
    if (checkingSponsors) {
      throw new Error ("Patrocinador já cadastrado no sistema!")
    }

    try {
      
      const crateSponsor = await prisma?.sponsors.create({
        data: {
          name,
          url,
          email,
          phone,
          company,
          cover: cover.linkUrl,
        },
      });
      return { message: "Patrocinador  criado com sucesso!" };
    } catch (error) {
      console.log(error);
      return this?.handleError(error);
    } finally {
      await this?.handleDisconnect();
    }
  }
  async updateSponsor(req: Request) {
    const { slug } = req.params;
    const { name, url, cover, email, phone, company } = req.body;
    const file = req.file as any
    try {
   
 
     
        const update = await prisma?.sponsors.update({
          where: {
            id: Number(slug),
          },
          data: {
            name,
            url,
            email,
            company,
            phone,
            cover: file ? file?.linkurl : cover,
          },
        });
        return { message: "Patrocinador  editado com sucesso!" };
      
    } catch (error) {
      console.log(error);
      return this?.handleError(error);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async deleteSponsor(req: Request) {
    const { slug } = req.params;

    if (!slug) {
     throw new Error ("Não foi possível encontrar o patrocinador!")
    }
    try {
      const deletMagazine = await prisma?.sponsors.delete({
        where: {
          id: Number(slug),
        },
      });
      return { message: "Patrocinador deletado com sucesso!" };
    } catch (error) {
      return this?.handleError(error);
    } finally {
      await this?.handleDisconnect();
    }
  }
 
}

const SponsorsModel = new Sponsor();
export default SponsorsModel;
