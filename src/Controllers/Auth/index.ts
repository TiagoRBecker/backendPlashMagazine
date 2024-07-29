import { Response, Request } from "express";
import prisma from "../../server/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
class Auth {
  //Funçao para tratar dos erros no servidor
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }

  async createAccount(req: Request, res: Response) {
    const {
      name,
      lastName,
      district,
      password,
      email,
      cep,
      adress,
      city,
      complement,
      numberAdress,
      avatar,
    
    } = req.body;

    try {
      const hash = await bcrypt.hash(password, Number(process.env.SALT));
      const chekingEmail = await prisma?.employee.findUnique({
        where: {
          email: email,
        },
      });
      if (chekingEmail) {
        return res
          .status(400)
          .json({ message: "E-mail já cadastrado no sistema!" });
      }
      const create = await prisma?.users.create({
        data: {
          name,
          lastName,
          password:hash,
          email,
          cep,
          adress,
          city,
          complement,
          numberAdress,
          district,
          avatar,
        },
      });
      return res.status(200).json({ message: "Conta criada com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async createAccountUserMaster(req: Request, res: Response) {
    const { name, password, email, avatar } = req.body;
    const hash = await bcrypt.hash(password, Number(process.env.SALT));
    const chekingEmail = await prisma?.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (chekingEmail) {
      return res.status(403).json("E-mail já cadastrado no banco de dados!");
    }
    try {
      const create = await prisma?.admin.create({
        data: {
          name,
          email,
          avatar,
          password: hash,
          role:"ADMIN"
        },
      });
      return res.status(200).json({ message: "Conta criada com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async authentication(req: Request, res: Response) {
    const { credentials } = req.body;

    const user = await prisma?.users.findUnique({
      where: {
        email: credentials.email,
      },
    });
  
    if (!user) {
      return res
        .status(404)
        .json({ message: "E-mail não cadastrado no sistema!" });
    }
    try {
      const match = await bcrypt.compare(credentials.password, user?.password as string);
      if (!match) {
        return res.status(401).json({ message: "E-mail ou senha invalidos" });
      }
      if (user) {
        const token = jwt.sign(
          {
            id: user?.id,
            crsfToken: credentials.csrfToken,
          },
          process.env.SECRET as string,
          { expiresIn: "1d" }
        );
  
        const saveToken = await prisma?.users.update({
          where: {
            email: credentials.email,
          },
          data: {
            crsfToken: token,
          },
        });
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          city: user.city,
          adress: user.adress,
          cep: user.cep,
          numberAdress: user.numberAdress,
          complement: user.complement,
          district: user.district,
          accessToken: token,
        });
      } else {
        return res.status(404).json({ message: "E-mail ou senha invalidos" });
      }
    } catch (error) {
      return this?.handleError(error,res)
    }
    finally{
      return this?.handleDisconnect()
    }
  
  }
  async authenticationAdmin(req: Request, res: Response) {
    const { credentials } = req.body;
 
    const userMaster = await prisma?.admin.findUnique({
      where: {
        email: credentials?.email,
      },
    });
    if (!userMaster) {
      return res
        .status(404)
        .json({ message: "E-mail não cadastrado no sistema!" });
    }
    try {
      const macth = await bcrypt.compare(
        credentials?.password,
        userMaster.password
      );
      if (macth) {
        const token = jwt.sign(
          {
            id: userMaster?.id,
            name: userMaster?.name,
            email: userMaster?.email,
            role: userMaster.role
          },
          process.env.SECRET as string,
          { expiresIn: 7 * 24* 60 *60 }
        );
  
        return res.status(200).json({
          id: userMaster.id,
          name: userMaster.name,
          email: userMaster.email,
          token: token,
        });
      } else {
        return res.status(401).json({ message: "E-mail ou senha inválidos" });
      }
    } catch (error) {
      return this?.handleError(error,res)
    }
    finally{
      return this?.handleDisconnect()
    }
    
  }

    async authenticationEmployee(req: Request, res: Response) {
      const { credentials } = req.body;
      
      const employee = await prisma?.employee.findUnique({
          where: {
              email: credentials.email,
          },
      });
      
      if (!employee) {
          return res
              .status(404)
              .json({ message: "E-mail não cadastrado no sistema!" });
      }
  
      try {
          const match = await bcrypt.compare(credentials.password as string, employee.password);
          
          if (!match) {
              return res.status(401).json({ message: "E-mail ou senha inválidos" });
          }
          
          const token = jwt.sign(
              {
                  id: employee.id,
                  crsfToken: credentials.csrfToken,
              },
              process.env.SECRET as string,
              { expiresIn: "1d" }
          );
          
        
          
          return res.status(200).json({
              id: employee.id,
              name: employee.name,
              email: employee.email,
              profession: employee.profession,
              avatar: employee.avatar,
              availableForWithdrawal: employee.availableForWithdrawal,
              accessToken: token,
          });
      } catch (error) {
          console.error('Erro durante a autenticação:', error);
          return this?.handleError(error,res);
      } finally {
          return this?.handleDisconnect()
      }
  }
}
const AuthControllers = new Auth();
export default AuthControllers;
