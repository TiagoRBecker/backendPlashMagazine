import { Response, Request } from "express";
import prisma from "../../server/prisma";
import bcrypt from "bcrypt";
import EmployeeModel from "../../models/employeesModel";
class Employee {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllEmployees(req: Request, res: Response) {
    try {
      const employees = await EmployeeModel.getAllEmployees(req);

      return res.status(200).json(employees);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async getLastEmployees(req: Request, res: Response) {
    try {
      const employees = await EmployeeModel.getLastEmployees(req);
      return res.status(200).json(employees);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async getOneEmployeeAdmin(req: Request, res: Response) {
    try {
      const employees = await EmployeeModel.getOneEmployeeAdmin(req);
      return res.status(200).json(employees);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async getOneEmployee(req: Request, res: Response) {
    
    try {
       const employee = await EmployeeModel.getOneEmployee(req)
      return res.status(200).json(employee);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  async createEmployee(req: Request, res: Response, next: any) {
    try {
      const employees = await EmployeeModel.createEmployee(req);
      return res.status(200).json(employees);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  }
  async editEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeModel.editEmployee(req);

      return res.status(200).json(employee?.message);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  async payComissionEmployee(req: Request, res: Response) {
    try {
      const employee = await EmployeeModel.payComissionEmploye(req);

      return res.status(200).json(employee?.message);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  async deletEmployee(req: Request, res: Response) {
    const { id } = req.body;
    try
     {
     const employee = await EmployeeModel.deletEmployee(req)
      return res
        .status(200)
        .json(employee?.message);
    }
    catch(error:any){
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
    
  }
  
}
const AdminEmployeeController = new Employee();
export default AdminEmployeeController;
