import { Request } from "express";
import prisma from "../server/prisma";

class DVL {
  //Função para tratar dos erros no servidor
  private handleError(error: any) {
    console.error(error);
    throw new Error("Internal Server Error");
  }

  //Função para desconectar o ORM Prisma
  private async handleDisconnect() {
    try {
      await prisma?.$disconnect();
    } catch (error) {
      console.error("Erro ao desconectar do banco de dados", error);
    }
  }

  //Retorna todas as divisões de lucro
  async getAllDvls(req: Request) {
    const { page, take, name } = req.query;

    try {
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;

      const dvls = await prisma?.dvls.findMany({
        take: totalTake,
        skip: skip,
        where: {
          paidOut: {
            gt: 0,
          },
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
        },
      });

      const listCount = await prisma?.dvls.count({
        where: {
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
        },
      });

      const finalPage = Math.ceil(Number(listCount) / totalTake);

      return { dvl: dvls, total: finalPage };
    } catch (error) {
      this.handleError(error);
    } finally {
      await this.handleDisconnect();
    }
  }

  //Retorna as últimas divisões de lucro
  async getLastDvls(req: Request) {
    try {
      const dvls = await prisma?.dvls.findMany({
        take: 5,
        distinct: ["name"],
        orderBy: {
          upDateDate: "asc",
        },
      });

      return dvls;
    } catch (error) {
      this.handleError(error);
    } finally {
      await this.handleDisconnect();
    }
  }

  //Retorna uma divisão de lucro específica
  async getOneDvl(req: Request) {
    const { slug } = req.params;
    
    if (!slug) {
      throw new Error("Erro ao encontrar a divisão de lucro!");
    }
    
    try {
      const dvl = await prisma?.dvls.findUnique({
        where: {
          id: Number(slug),
        },
      });
      
      return dvl;
    } catch (error) {
      this.handleError(error);
    } finally {
      await this.handleDisconnect();
    }
  }

  //Cria uma divisão de lucro
  async createDVL(data: any, magazines: any) {
    try {
      const dvl = magazines?.map((items: any) => {
        return {
          name: items.name,
          price: items.price,
          picture: items.cover,
          paidOut: Math.round(Number(items.price * 2) * 100) / 100,
          toReceive: 0,
          userId: Number(data.metadata.id),
        };
      });

      for (const item of dvl as any) {
        await prisma?.dvls.create({
          data: item,
        });
      }

      return { message: "Divisão de lucro criada com sucesso" };
    } catch (error) {
      this.handleError(error);
    } finally {
      await this.handleDisconnect();
    }
  }

  //Atualiza uma divisão de lucro específica
  async updateDvl(req: Request) {
    const { slug } = req.params;
    const { pay } = req.body;

    if (!slug || pay === "" || isNaN(Number(pay))) {
      throw new Error("Erro! Dados inválidos para prosseguir com a operação!");
    }

    try {
      const updatedDvls = await prisma?.dvls.updateMany({
        where: {
          id: Number(slug),
        },
        data: {
          toReceive: {
            increment: Number(pay),
          },
          paidOut: {
            decrement: Number(pay),
          },
        },
      });

      const totalToReceive = await prisma?.dvls.aggregate({
        _sum: {
          toReceive: true,
        },
        where: {
          id: Number(slug),
        },
      });

      await prisma?.$transaction(async (prisma) => {
        const usersToUpdate = await prisma.users.findMany({
          where: {
            dvlClient: {
              some: {
                id: Number(slug),
              },
            },
          },
        });

        await Promise.all(
          usersToUpdate.map(async (user) => {
            await prisma.users.update({
              where: {
                id: user.id,
              },
              data: {
                availableForWithdrawal: {
                  increment: Number(totalToReceive?._sum.toReceive),
                },
              },
            });
          })
        );
      });

      return { message: "Atualizado com sucesso!" };
    } catch (error) {
      this.handleError(error);
    } finally {
      await this.handleDisconnect();
    }
  }
}

const DvlModel = new DVL();
export default DvlModel;
