import { Response, Request } from "express";
import prisma from "../../server/prisma";
import { bucket } from "../../utils/multerConfig";
import { AdminEventModel, EventModel } from "../../models/eventsModel";
class Events {
  private handleError(error: any, res: Response) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllEvents(req: Request, res: Response) {
    try {
      const covers = await EventModel.getAllEvents(req);
      return res.status(200).json(covers);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    }
  }

  async getEventID(req: Request, res: Response) {
    try {
      const eventID = await EventModel.getEventID(req);
      return res.status(200).json(eventID);
    } catch (error:any) {
      console.log(error);
      return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
    }
  }
}
class AdminEvents {
  private handleError(error: any, res: Response) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.getAllEvents(req);
      return res.status(200).json(events);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    }
  }
  async getEventID(req: Request, res: Response) {
    try {
      const eventID = await AdminEventModel.getEventID(req);
      return res.status(200).json(eventID);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    }
  }
  async getLastEvent(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.getLastEvent(req);

      return res.status(200).json(events);
    } catch (error: unknown) {
      return this?.handleError(error, res);
    }
  }
  async createEvent(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.createEvent(req);
      return res.status(200).json({ message: "Evento criado com sucesso!" });
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    }
  }
  async updateEvent(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.updateEvent(req);

      return res.status(200).json({ message: "Evento criado com sucesso" });
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    }
  }

  async deleteSponsorEvent(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.deleteSponsorEvent(req);
      return res
        .status(200)
        .json({ message: "Patrocinador removido  com sucesso!" });
    } catch (error) {
      return this?.handleError(error, res);
    }
  }
  async deletEvent(req: Request, res: Response) {
    try {
      const events = await AdminEventModel.deletEvent(req);

      return res.status(200).json({ message: "Evento Deletado com sucesso" });
    } catch (error) {
      return this?.handleError(error, res);
    }
  }
}
export const EventController = new Events();
export const AdminEventController = new AdminEvents();
