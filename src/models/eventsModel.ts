import { Response, Request } from "express";
import prisma from "../server/prisma";

class PublicModel {
  private handleError() {
    throw new Error("Error:Erro no sisetma  tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    await prisma?.$disconnect();
  }
  async getAllEvents(req: Request) {
    try {
      const covers = await prisma?.eventsofMonth.findMany({
        include: {
          sponsors: {
            select: {
              id: true,

              url: true,
              cover: true,
            },
          },
        },
      });
      return covers;
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }

  async getEventID(req: Request) {
    const { slug } = req.params;
    if (!slug) {
      throw new Error("Evento não encontrado!");
    }
    try {
      const eventId = await prisma?.eventsofMonth.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          sponsors:{
            select:{
              cover:true,
              url:true,
              company:true,
              id:true,
            }
          }
        },
      });
       await prisma?.eventsofMonth.update({
        where:{
          id:eventId?.id
        },
        data:{
          views:{
            increment:1
          }
        }
       })

      return eventId;
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
}
class AdminEvents {
  private handleError() {
    throw new Error("Error:Erro no sisetma  tente novamente mais tarde!");
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    await prisma?.$disconnect();
  }
  async getAllEvents(req: Request) {
    const { event, name, email, page, take } = req.query;
    try {
      const totalTake = Number(take) || 8;
      const currentPage = Number(page) || 1;
      const skip = (currentPage - 1) * totalTake;
      const events = await prisma?.eventsofMonth.findMany({
        take: totalTake,
        skip,
        where: {
          name: {
            contains: (event as string) || "",
            mode: "insensitive",
          },
          email: {
            contains: (email as string) || "",
            mode: "insensitive",
          },
          organizer: {
            contains: (name as string) || "",
            mode: "insensitive",
          },
        },
        include: {
          sponsors: {
            select: {
              id: true,

              url: true,
              cover: true,
            },
          },
        },
      });
      const listCount: any = await prisma?.eventsofMonth.count();
      const finalPage = Math.ceil(listCount / totalTake);
      return { events, finalPage };
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getLastEvent(req: Request) {
    try {
      const events = await prisma?.eventsofMonth.findMany({
        take: 4,
      });

      return events;
    } catch (error: unknown) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async createEvent(req: Request) {
    const {
      name,
      organizer,
      email,
      phone,
      date_event_initial,
      date_event_end,
      descript,
    } = req.body;

    const sponsor = JSON.parse(req.body.sponsors);
    const { banner, cover } = req.files as any;

    try {
      await prisma?.$transaction(async (prisma) => {
        const ids = sponsor?.map((item: any) => parseInt(item.id));
        const getCovers = await prisma.sponsors.findMany({
          where: {
            id: {
              in: ids,
            },
          },
        });

        // Cria o evento
        const createEvent = await prisma.eventsofMonth.create({
          data: {
            name,
            descript,
            email,
            phone,
            banner: banner[0].linkUrl,
            date_event_end,
            date_event_initial,
            cover: cover[0].linkUrl,
            organizer: organizer,
            sponsors: {
              connect: getCovers.map((cover: any) => ({ id: cover.id })),
            },
          },
        });

        return { message: "Evento criado com sucesso" };
      });
    } catch (error) {
      console.log(error);
      return this.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async updateEvent(req: Request) {
    const { slug } = req.params;
    const {
      name,
      organizer,
      date_event_initial,
      date_event_end,
      descript,
      cover,
      banner,
      email,
      phone,
    } = req.body;

    const sponsor = JSON.parse(req.body.sponsors);

    const { newCover, newBanner } = req.files as any;

    try {
      await prisma?.$transaction(async (prisma) => {
        const ids = sponsor?.map((item: any) => parseInt(item.id));
        const getSponsors = await prisma.sponsors.findMany({
          where: {
            id: {
              in: ids,
            },
          },
        });

        // Cria o evento
        const updateEvent = await prisma.eventsofMonth.update({
          where: {
            id: Number(slug),
          },
          data: {
            name,
            descript,
            banner: newBanner ? newBanner[0]?.linkUrl : banner,
            phone,
            email,
            cover: newCover ? newCover[0]?.linkUrl : cover,
            date_event_initial: date_event_initial,
            date_event_end: date_event_end,
            organizer: organizer,
            sponsors: getSponsors.length > 0 ? {
                connect: getSponsors.map((cover: any) => ({ id: cover.id })),
              } : undefined,
          },
        });

        return{ message: "Evento atualizado com sucesso" };
      });
    } catch (error) {
      console.log(error);
      return this.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async getEventID(req: Request) {
    const { slug } = req.params;
    if (!slug) {
      throw new Error("Evento não encontrado!");
    }
    try {
      const eventId = await prisma?.eventsofMonth.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          sponsors:true
           
          }
        
      });

      return eventId;
    } catch (error) {
      console.log(error);
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async deleteSponsorEvent(req: Request) {
    const { eventID, id } = req.body;
    if (!eventID) {
      throw new Error("Patrocinador não encontrado no evento!")
    }
    try {
      const deleteEvent = await prisma?.eventsofMonth.update({
        where: {
          id: Number(eventID),
        },
        data: {
          sponsors: {
            disconnect: {
              id: Number(id),
            },
          },
        },
      });
      return { message: "Patrocinador removido  com sucesso!" };
    } catch (error) {
        console.log
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
  async deletEvent(req: Request) {
    const { slug } = req.params;
    if(!slug){
       throw new Error ("Evento não encontrado!")
    }
    try {
      const createCover = await prisma?.eventsofMonth.delete({
        where: {
          id: Number(slug),
        },
      });

      return { message: "Evento Deletado com sucesso" };
    } catch (error) {
      return this?.handleError();
    } finally {
      await this?.handleDisconnect();
    }
  }
}
export const EventModel = new PublicModel();
export const AdminEventModel = new AdminEvents();
