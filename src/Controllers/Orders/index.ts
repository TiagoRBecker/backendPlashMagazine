import { Response, Request } from "express";
import prisma from "../../server/prisma";
import OrdersModel from "../../models/ordersModel";

class Orders {
  //Funçao para tratar dos erros no servidor

 
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  //Retorna todas as categorias
  async chartJsOrders(req: Request, res: Response) {
    try {
      const orders = await OrdersModel.chartJsOrders(req)

      return res.status(200).json(orders);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getAllOrders(req: Request, res: Response) {
    
    try {
      const orders = await OrdersModel.getAllOrders(req)

      return res.status(200).json(orders);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } finally {
      return this?.handleDisconnect();
    }
  }
  async getLastOrders(req: Request, res: Response) {
    try {
       const orders = await OrdersModel.getLastOrders(req)

      return res.status(200).json(orders);
    } catch (error:any) {
      console.log(error);
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
  //Retorna uma categoria especifica
  async getOneOrder(req: Request, res: Response) {
    

    try {
      const orders = await OrdersModel.getOneOrder(req)

      return res.status(200).json(orders);
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }

  //Atualiza uma categoria especifica
  async updateOrder(req: Request, res: Response) {


    
    try {
       const orders = await OrdersModel.updateOrder(req)
      return res
        .status(200)
        .json({ message: "Ordem de serviço atualizada com sucesso!" });
    } catch (error:any) {
      return res.status(500).json({ error: error?.message || "Internal Server Error" });
    } 
  }
 
}

const OrdersController = new Orders();
export default OrdersController;
