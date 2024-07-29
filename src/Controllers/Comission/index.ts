import { Response, Request } from "express";
import { CommissionModel } from "../../models/commissiomModel";

class Comission {
    //Funçao para tratar dos erros no servidor
    private handleError(error: any, res: Response) {
      console.error(error);
      throw new Error ("Erro tente novamente mais tarde!");
    }
    //Função para desconetar o orm prisma
    private async handleDisconnect() {
      return await prisma?.$disconnect();
    }
    async getLastCommission (req:Request,res:Response){
       try {
         const comssion = await CommissionModel.getLastComission()
         return res.status(200).json(comssion)
       } catch (error) {
         console.log(error)
         return this?.handleError
       }
       
    }
    async getComissionEmployee (req:Request,res:Response){
      try {
        const comssion = await CommissionModel.getEmployeeDvl(req)
        return res.status(200).json(comssion)
      } catch (error) {
        console.log(error)
        return this?.handleError
      }
    }
    async updateComissionEmployee (req:Request,res:Response){
      try {
        const comssion = await CommissionModel.updateEmployeeCommissiom(req)
        return res.status(200).json(comssion)
      } catch (error) {
        console.log(error)
        return this?.handleError
      }
    }
}
export const AdminComissionController = new Comission()