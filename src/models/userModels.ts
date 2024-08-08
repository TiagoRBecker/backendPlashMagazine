type Query = {
  page: string;
  take: string;
  price: string;
  name: string;
  email: string;
};
import { Request } from "express";
import prisma from "../server/prisma";
import { bcryptService } from "../service/bcryptService";
import { CloudStorageService } from "../service/cloudStorage";
class User {
  private handleError() {
    throw new Error("Erro: Erro no servidor tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }

  async getAllUsers(query: Query) {
    const { page, take, price, name, email } = query;
    const totalTake = Number(take) || 8;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * totalTake;
    const users = await prisma?.users.findMany({
      take: totalTake,
      skip: skip,
      where: {
        name: {
          contains: (name as string) || "",
          mode: "insensitive",
        },
        email: {
          contains: (email as string) || "",
          mode: "insensitive",
        },
        availableForWithdrawal: {
          gte: Number(price) || 0,
        },
      },
      select: {
        name: true,
        lastName: true,
        email: true,
        id: true,
        avatar: true,
        availableForWithdrawal: true,
      },
    });

    const listCount = await prisma?.users.count({
      where: {
        name: {
          contains: (name as string) || "",
          mode: "insensitive",
        },
        email: {
          contains: (email as string) || "",
          mode: "insensitive",
        },
        availableForWithdrawal: {
          gte: Number(price) || 0,
        },
      },
    });
    const finalPage = Math.ceil(Number(listCount) / totalTake);
    return { users, finalPage };
  }
  async getOneUSer(req: Request) {
    const { name, cat, orderBy } = req.query;
    const id = req.user.id;
    if (!id) {
      throw new Error("Usuário nao encontrado ou identificador  não válido!");
    }
    const user = await prisma?.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        city: true,
        adress: true,
        cep: true,
        district: true,
        complement: true,
        numberAdress: true,
        
      
       
      },
    });
    return user;
  }
  async userEditPerfil(req:Request){
    const {
      name,
      lastName,
      city,
      cep,
      district,
      numberAdress,
      complement,
      address,
    } = req.body;
    
    const id = req.user.id;

    try {
      const updatePerfil = await prisma?.users.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          lastName,
          city,
          cep,
          adress: address,
          district,
          numberAdress,
          complement,
        },
      });

      return { message: "Atualizado com sucesso" };
    } catch (error:any) {
      console.log(error);
      throw  new Error(error.message || "Internal server error!")
    } finally {
      await this?.handleDisconnect();
    }
  
  }
  async userEditPass(req: Request) {
    try {
      const { data } = req.body;

      const id = req.user.id;
      const user = await prisma?.users.findUnique({
        where: { id: Number(id) },
      });
      const match = await bcryptService.comparePassword(
        data.password,
        user?.password as string
      );
      if (!match) {
        throw new Error("Senha inválida. Tente novamente.");
      }
      const hash = await bcryptService.hashPassword(data.newPassword);
      const getUser = await prisma?.users.update({
        where: {
          id: Number(id),
        },
        data: {
          password: hash,
        },
      });
      return { message: "Sua senha foi alterada com sucesso!" };
    } catch (error: any) {
      console.log(error);
      throw new Error(
        error.message || "Erro no sistema. Tente novamente mais tarde."
      );
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getOrderUser(req: Request) {
    try {
      const id = req.user.id;
      if (!id) {
        throw new Error("Usuário nao encontrado ou identificador  não válido!");
      }
      const user = await prisma?.users.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          orders: true,
        },
      });
      return user?.orders;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Internal server error!");
    } finally {
      await this.handleDisconnect();
    }
  }
  async getOrderUserID(req: Request) {
    try {
      const id = req.user.id;
      const { slug } = req.params;
      if (!id) {
        throw new Error("Usuário nao encontrado ou identificador  não válido!");
      }
      const user = await prisma?.users.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          orders: {
            where: {
              id: Number(slug),
            },
          },
        },
      });
      return user?.orders;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Internal server error!");
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getDvlUser(req: Request) {
    try {
      const id = req.user.id;
      if (!id) {
        throw new Error("Usuário nao encontrado ou identificador  não válido!");
      }
      const user = await prisma?.users.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          email: true,
          name: true,
          availableForWithdrawal: true,
          dvlClient: true,
        },
      });
      return user;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Internal server error!");
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getLibraryUser(req: Request) {
    const { name, orderBy } = req.query;
    const id = req.user.id;

    try {
      const user = await prisma?.libraryUser.findMany({
        orderBy: {
          createDate: (orderBy as any) || "desc",
        },
        where: {
          userId: Number(id),
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          cover: true,
          name: true,
        },
      });
      return user;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getOneBookLibraryUser(req: Request) {
    const { slug } = req.params;
    const id = req.user.id;

    console.log(req.query);
    if (!slug) {
      throw new Error("Erro ao localizar a revista!");
    }

    try {
      const magazine = await prisma?.users.findUnique({
        where: {
          id: Number(req.user.id),
        },
        select: {
          library: {
            where: {
              id: Number(slug),
            },
          },
        },
      });
      //@ts-ignore
      const url = magazine?.library[0].magazine_pdf;
      const filePath: any = url?.split("plash_bucket/");

      const urlPublic = await CloudStorageService.urlFilePublic(filePath[1]);
      return urlPublic;
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async deleteUser(req: Request) {
    const id = req.user.id;
    const { data } = req.body;

    try {
      const user = await prisma?.users.findUnique({
        where: {
          id: Number(id),
        },
      });

      const match = await bcryptService.comparePassword(
        data,
        user?.password as string
      );
      if (!match) {
        throw new Error("Senha atual inválida. Tente novamente!");
      }
      const deleteUser = await prisma?.users.delete({
        where: {
          id: Number(id),
        },
        include: {
          articlesByUser: true,
          dvlClient: true,
          orders: true,
          OTP: true,
          library: true,
          vote: true,
        },
      });
      return { message: "Conta deletada com sucesso!" };
    } catch (error: any) {
      console.error(error);
      throw new Error(error?.message || "Internal server error!");
    } finally {
      await this?.handleDisconnect();
    }
  }
}

export const UserModel = new User();
