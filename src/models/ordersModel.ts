import { Response, Request } from "express";
import prisma from "../server/prisma";

class Orders {
  //Funçao para tratar dos erros no servidor

  private handleError() {
    
    throw new Error ("Erro: Erro no sistema tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
     await prisma?.$disconnect();
  }
  //Retorna ordem de serviço para ser exibido o fluxo de caixa
  async chartJsOrders(req: Request) {
    try {
      const orders = await prisma?.orders.findMany({});

      return orders;
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getAllOrders(req: Request) {
    const { name, email, page, city, take, status, id, date } = req.query;
    
    try {
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;
      const enumStatus = ["andamento", "enviado", "entregue"];
      const where = {
        ...(name && {
          name: { contains: name as string, mode: "insensitive" },
        }),
        ...(email && {
          email: { contains: email as string, mode: "insensitive" },
        }),
        ...(city && {
          city: { contains: city as string, mode: "insensitive" },
        }),
        ...(id && { id: Number(id) }),
        ...(date &&
          !isNaN(Date.parse(date as any)) && {
            createDate: { gte: new Date(date as any) },
          }),
        ...(status &&
          enumStatus.includes(status as string) && {
            status: status as any,
            
          }),
      };

      const orders = await prisma?.orders.findMany({
        
        take: totalTake,
        skip: skip,
        where: Object.keys(where).length ? (where as any) : undefined,
      });

      const listCount = await prisma?.orders.count();
      const finalPage = Math.ceil(Number(listCount) / totalTake);

      return { orders: orders, total: finalPage };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna as últimas ordem de serviço 
  async getLastOrders(req: Request) {
    try {
      const orders = await prisma?.orders.findMany({
        take: 5,
        orderBy: {
          createDate: "desc", // Ordena pela data de criação em ordem decrescente
        },
        where: {
          status: "andamento",
        },
        include: {
          user: {
            select: {
              name: true,
              lastName: true,
              email: true,
              adress: true,
              city: true,
              district: true,
              cep: true,
              complement: true,
            },
          },
        },
      });
     

      return orders;
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  //Retorna uma ordem de serviço 
  async getOneOrder(req: Request) {
    const { slug } = req.params;

    try {
      const getOrder = await prisma?.orders.findUnique({
        where: { id: Number(slug) },

        include: {
          user: {
            select: {
              name: true,
              lastName: true,
            },
          },
        },
      });

      return getOrder;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }

  //Atualiza uma ordem de serviço 
  async updateOrder(req: Request) {
    const { data } = req.body;
    const { slug } = req.params;

    if (!slug) {
        throw new Error("Não foi possivel localizar a ordem de serviço!")
      
    }
    try {
      const updateOrder = await prisma?.orders.update({
        where: {
          id: Number(slug),
        },
        data: {
          codeEnv: data.codEnv,
          status: data.status,
        },
      });
      return { message: "Ordem de serviço atualizada com sucesso!" };
    } catch (error) {
      return this.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
 
}

const OrdersModel = new Orders();
export default OrdersModel;
