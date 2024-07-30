import { Response, Request } from "express";
import prisma from "../server/prisma";
import bcrypt from "bcrypt";
class Employee {
  //Funçao para tratar dos erros no servidor
  private handleError() {
    throw new Error("Error:Erro interno no sistema!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    await prisma?.$disconnect();
  }
  async getAllEmployees(req: Request) {
    const { name, email, page, take, profession } = req.query;

    try {
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;
      const employees = await prisma?.employee.findMany({
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
          profession: {
            contains: (profession as string) || "",
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          avatar: true,
          name: true,
          email: true,
          phone: true,
          commission: true,
          profession: true,
          magazines: true,
          dvl_employee: true,
          availableForWithdrawal: true,
        },
      });

      const listCount = await prisma?.employee.count({
        where: {
          name: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
          email: {
            contains: (email as string) || "",
            mode: "insensitive",
          },
          profession: {
            contains: (profession as string) || "",
            mode: "insensitive",
          },
        },
      });
      const finalPage = Math.ceil(Number(listCount) / totalTake);

      return { employee: employees, total: finalPage };
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getLastEmployees(req: Request) {
    try {
      const getAllEmployee = await prisma?.employee.findMany({
        take: 5,
        orderBy: {
          createDate: "asc",
        },
      });
      return getAllEmployee;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getOneEmployeeAdmin(req: Request) {
    const { slug } = req.params;
    try {
      const employeeWithDvls = await prisma?.employee.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          dvl_employee: true,

          magazines: true,
        },
      });
      return employeeWithDvls;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getOneEmployee(req: Request) {
    const id = req.user.id;
    try {
      const employeeWithDvls = await prisma?.employee.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          availableForWithdrawal: true,
          dvl_employee: true,
        },
      });
      return employeeWithDvls;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async createEmployee(req: Request) {
    const { name, email, password, profession, phone, commission } = req.body;
    const file = req.file as any;

    const chekingEmail = await prisma?.employee.findUnique({
      where: {
        email: email,
      },
    });
    if (chekingEmail) {
      throw new Error("Email já cadastrado no sistema");
    }
    try {
      const hash = await bcrypt.hash(password, Number(process.env.SALT));
      const create = await prisma?.employee.create({
        data: {
          name,
          email,
          profession,
          phone,
          password: hash,
          avatar: file.linkUrl,
          commission: Number(commission),
        },
      });
      return { message: "Colaborador criado com sucesso!" };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async editEmployee(req: Request) {
    const { slug } = req.params;
    const { name, email, profession, phone, avatar, password,commission } = req.body;
    const newProfile = req?.file as any;
   
    try {
     
      const hash = await bcrypt.hash(password, Number(process.env.SALT));

      const update = await prisma?.employee.update({
        where: {
          id: Number(slug),
        },
        data: {
          name,
          email,
          profession,
          phone,
          commission:Number(commission),
          avatar: newProfile ? newProfile.linkUrl : avatar,
          password: hash,
        },
      });
      return { message: "Colaborador editado com sucesso!" };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async payComissionEmploye(req: Request) {
    const { id, pay } = req.body;

    if (!id) {
      throw new Error("Colaborador não encontrado!");
    }

    try {
      const update = await prisma?.employee.update({
        where: {
          id: Number(id),
        },
        data: {
          availableForWithdrawal: {
            decrement: Number(pay),
          },
        },
      });
      return { message: "Pagamento efetuado  com sucesso!" };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async deletEmployee(req: Request) {
    const { id } = req.body;

    if (!id) {
      throw new Error("Colaborador não encontrado!");
    }
    try {
      const deletEmployee = await prisma?.employee.delete({
        where: {
          id: Number(id),
        },
      });
      return { message: "Colaborador deletado com sucesso" };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
}
const EmployeeModel = new Employee();
export default EmployeeModel;
