import { Response, Request } from "express";
import prisma from "../../server/prisma";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/userModels";
class User {
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllUsers(req: Request, res: Response) {
  
    
    try {
    
      const users = await UserModel.getAllUsers(req.query as any)
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getLastUsers(req: Request, res: Response) {
    try {
      const getUser = await prisma?.users.findMany({
        take: 4,
        orderBy: {
          createDate: "asc",
        },
        select: {
          name: true,
          email: true,
          createDate: true,
        },
      });
      return res.status(200).json(getUser);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getOneUser(req: Request, res: Response) {
    

    try {
       const user = await UserModel.getOneUSer(req.user?.id)
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getOneUserAdmin(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const getUser = await prisma?.users.findUnique({
        where: {
          id: Number(slug),
        },
        select: {
          name: true,
          lastName: true,
          email: true,
          id: true,
          city: true,
          adress: true,
          cep: true,
          district: true,
          complement: true,
          numberAdress: true,
          dvlClient: true,
          availableForWithdrawal: true,
        },
      });
   
      return res
        .status(200)
        .json(getUser);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async changePassUser(req: Request, res: Response) {
    const { data } = req.body;

    const id = req.user.id;
    try {
      const user = await prisma?.users.findUnique({
        where: { id: Number(id) },
      });
      const match = await bcrypt.compare(
        data.password,
        user?.password as string
      );
      if (!match) {
        return res.status(403).json({ message: "Senha inválida" });
      }
      const hash = await bcrypt.hash(
        data.newPassword,
        Number(process.env.SALT)
      );
      const getUser = await prisma?.users.update({
        where: {
          id: Number(id),
        },
        data: {
          password: hash,
        },
      });
      return res
        .status(200)
        .json({ message: "Sua senha foi alterada com sucesso!" });
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async updatePerfilUser(req: Request, res: Response) {
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
    console.log(req.body);
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

      return res
        .status(200)
        .json({ message: "Atualizado com sucesso", updatePerfil });
    } catch (error) {
      console.log(error);
      return this.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }

  async deletUser(req: Request, res: Response) {
    const id = req.user.id;
    const { password } = req.body;
    try {
      const user = await prisma?.users.findUnique({
        where: {
          id: Number(id),
        },
      });
      const match = await bcrypt.compare(password, user?.password as string);
      if (!match) {
        return res.status(403).json({ message: "senha Inválida!" });
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
      return res.status(200).json({ message: "Conta deletada com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }


  async getLibraryUser(req: Request, res: Response) {
    const { name, orderBy } = req.query;
    const id = req.user.id;

    try {
      const request = await prisma?.libraryUser.findMany({
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
      return res.status(200).json(request);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getOneBookLibraryUser(req: Request, res: Response) {
    const { slug } = req.params;
    console.log(slug);
    try {
      const request = await prisma?.libraryUser.findUnique({
        where: {
          id: Number(slug),
          userId: Number(req.user.id),
        },
        select: {
          magazine_pdf: true,
        },
      });
      return res.status(200).json(request);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getOneArticleUser(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const request = await prisma?.articlesByUser.findFirst({
        where: {
          id: Number(slug),
          userId: Number(req.user.id),
        },
        select: {
          name: true,
          articlepdf: true,
        },
      });
      return res.status(200).json(request);
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async updateDvlUser(req: Request, res: Response) {
    const { slug } = req.params;
    const { pay } = req.body;

    try {
      await prisma?.$transaction(async (prisma) => {
        const getUser = await prisma?.users.update({
          where: {
            id: Number(slug),
          },
          data: {
            availableForWithdrawal: {
              decrement: Number(pay),
            },
          },
        });

        return res.status(200).json({ message: "Atualizado com sucesso" });
      });
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}

const UserController = new User();
export default UserController;
