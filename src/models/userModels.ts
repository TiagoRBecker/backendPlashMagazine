type Query = {
  page: string;
  take: string;
  price: string;
  name: string;
  email: string;
};
import prisma from "../server/prisma";
import { bcryptService } from "../service/bcryptService";
class User {
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
  async getOneUSer(id: number) {
     if(!id){
         throw new Error("Usuário nao encontrado ou identificador  não válido!")
     }
    const user = await prisma?.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id:true,
        name: true,
        lastName: true,
        email: true,
        city: true,
        adress: true,
        cep: true,
        district: true,
        complement: true,
        numberAdress: true  ,    
        availableForWithdrawal:true
      },
    });
    return user;
  }
 
}
export const UserModel = new User();
