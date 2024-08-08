import { Response, Request } from "express";
import prisma from "../../server/prisma";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/userModels";
class User {
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  
 
  async getOneUser(req: Request, res: Response) {
    

    try {
       const user = await UserModel.getOneUSer(req)
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getDvls (req:Request,res:Response){
    try {
      const user = await UserModel.getDvlUser(req)
     return res.status(200).json(user);
   } catch (error) {
     console.log(error);
     return this?.handleError(error, res);
   } finally {
     return this?.handleDisconnect();
   }
  }
  async getOrders (req:Request,res:Response){
    try {
      const user = await UserModel.getOrderUser(req)
     return res.status(200).json(user);
   } catch (error) {
     console.log(error);
     return this?.handleError(error, res);
   } finally {
     return this?.handleDisconnect();
   }
  }
  async getOrderID (req:Request,res:Response){
    try {
      const user = await UserModel.getOrderUserID(req)
     return res.status(200).json(user);
   } catch (error) {
     console.log(error);
     return this?.handleError(error, res);
   } finally {
     return this?.handleDisconnect();
   }
  }
  async changePassUser(req: Request, res: Response) {
    try {
      const user = await UserModel.userEditPass(req)
     
      return res.status(200).json(user)
    } catch (error:any) {
      console.log(error)
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async updatePerfilUser(req: Request, res: Response) {
   

    try {
    
       const user = await UserModel.userEditPerfil(req)
      return res
        .status(200)
        .json({ message: "Atualizado com sucesso" });
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({error:error.message ||  "Internal server error"} );
    } 
  }

 


  async getLibraryUser(req: Request, res: Response) {
    try {
      const user = await UserModel.getLibraryUser(req)
      return res.status(200).json(user)
    } catch (error:any) {
      console.log(error)
      return this.handleError(error,res)
    }
    
  }
  async getOneBookLibraryUser(req: Request, res: Response) {
    
   
    try {
       const user = await UserModel.getOneBookLibraryUser(req)
      return res.status(200).json(user);
    } catch (error) {
      return this?.handleError(error, res);
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
  async deletUser(req: Request, res: Response) {
 
    try {
      const user = await UserModel.deleteUser(req)
      
      
      return res.status(200).json({ message: "Conta deletada com sucesso!" });
    } catch (error:any) {
       console.log(error)
      return res.status(500).json({error:error.message || "Internal server error!"})
    } 
  }
 
}
class AdminUser {
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

export const UserController = new User();
export const AdminUserController = new AdminUser();
