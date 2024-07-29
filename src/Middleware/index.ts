import { Request, Response, NextFunction } from "express";
import prisma from "../server/prisma";
import Jwt, { JsonWebTokenError } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string;
        email: string;
        avatar: string;
      };
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      admin: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        role:string,
      };
    }
  }
}

export const chekingTokenUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  const secret = process.env.SECRET;
  if (!authorization) {
    return res.status(401).json({ msg: "Não autorizado" });
  }

  const [authtype, token] = authorization.split(" ");

  if (authtype === "Bearer") {
    try {
      const payload = Jwt.verify(token, secret as string) as { id: number };
      
      const user = await prisma?.users.findUnique({
        where: { id: payload.id },
        select:{
          name:true,
          email:true,
          lastName:true,
          id:true
        }
      });
     
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

     
      
      

      // Associar o usuário à requisição
      req.user = user as any;
      next();
    } catch (error) {
      console.error("Erro durante a verificação do token:", error);
      return res.status(401).json({ msg: "Não autorizado" });
    }
  } else {
    return res.status(401).json({ msg: "Tipo de autenticação inválido" });
  }
};
export const checkingTokenEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  const secret = process.env.SECRET;
  if (!authorization) {
    return res.status(401).json({ msg: "Não autorizado" });
  }

  const [authtype, token] = authorization.split(" ");

  if (authtype === "Bearer") {
    try {
      const payload = Jwt.verify(token, secret as string) as { id: number };
    
      const user = await prisma?.employee.findUnique({
        where: { id: payload.id },
        select:{
          id:true,
         
         
          
        }
      });
     
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

     
      
      

      // Associar o usuário à requisição
      req.user = user as any;
      next();
    } catch (error) {
      console.error("Erro durante a verificação do token:", error);
      return res.status(401).json({ msg: "Não autorizado" });
    }
  } else {
    return res.status(401).json({ msg: "Tipo de autenticação inválido" });
  }
};
export const chekingTokenAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  const secret = process.env.SECRET;
  if (!authorization) {
    return res.status(403).json({ msg: "Não autorizado" });
  }

  const [authtype, token] = authorization.split(" ");

  if (authtype === "Bearer") {
    try {
      const payload = Jwt.verify(token, secret as string) as { id: number };
      
      const admin = await prisma?.admin.findUnique({
        where: { id: payload.id }
      });
     
      if (!admin) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      if(admin.role !== "ADMIN"){
        return res.status(403).json({message:"Não autorizado!"})
      }
      
      

      // Associar o usuário à requisição
      req.admin = admin as any;
      next();
    } catch (error) {
      console.error("Erro durante a verificação do token:", error);
      return res.status(403).json({ msg: "Não autorizado" });
    }
  } else {
    return res.status(401).json({ msg: "Tipo de autenticação inválido" });
  }
};