import { Request } from "express";
import prisma from "../server/prisma";
class Comission {
  private handleError() {
   
    throw new Error("Erro tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getLastComission() {
    try {
      const dvls = await prisma?.dvls_Employee.findMany({
        take: 5,
        distinct: ["name"],
        orderBy: {
          upDateDate: "asc",
        },
      });

      return dvls;
    } catch (error) {
      console.log(error);
      return this?.handleError;
    } finally {
      await this?.handleDisconnect();
    }
  }
  async createDvlsForCollaborators(magazines: any) {
     try {
      for (const magazine of magazines) {
        for (const employee of magazine.employees) {
          const createdDvl = await prisma?.dvls_Employee.create({
            data: {
              name: magazine.name,
              price: magazine.price,
              picture: magazine.cover,
              paidOut:
                Math.round(Number(magazine.price * employee.commission) * 100) /
                100,
              toReceive: 0,
              employee: { connect: { id: employee.id } },
            },
          });
        }
      }
      return {message:"Comissão adicionada com sucesso!"}
     } catch (error) {
      throw new Error("Erro tente novamente mais tarde!");
     }
     finally{
      await this?.handleDisconnect()
     }
      
    
    
  }
  async getEmployeeDvl(req: Request) {
    const { slug } = req.params;
    
  

    try {
    
        const dvlEmployee = await prisma?.dvls_Employee.findUnique({
          where: {
            id: Number(slug),
          },
          select:{
            id:true,
            name:true,
            paidOut:true,
            toReceive:true,
            picture:true,
            price:true,
            createDate:true,
            employee:{
              select:{
                id:true,
                commission:true,
              }
            }
          }
         
        });
        
        return dvlEmployee;
     
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
 
  }
  async updateEmployeeCommissiom(req: Request) {
    const { slug } = req.params;
    const { pay, id } = req.body
 
  
    try {
    
        const dvlEmployee = await prisma?.dvls_Employee.update({
           where:{
            id:Number(slug)
           },
           data: {
            toReceive: {
              increment: Number(pay),
            },
            paidOut: {
              decrement:  Number(pay),
            },
          
          },
         
         
        });
        const totalToReceive = await prisma?.dvls_Employee.aggregate({
          _sum: {
            toReceive: true,
          },
          where: {
            id: Number(slug),
           
          },
        });  
       
          await prisma?.employee.update({
            where: {
              id: Number(id),
            },
            data: {
              availableForWithdrawal: {
                increment:Number(totalToReceive?._sum.toReceive)
              },
            },
          });
        
      
    
        
       
         
        return {message:"Comissão paga com sucesso"};
          
     
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
      
      
    
      
 
  }
}
export const CommissionModel = new Comission();
