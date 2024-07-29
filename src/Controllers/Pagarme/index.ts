import { Request, Response, response } from "express";
import { io } from "../../server";
import { createChekout } from "../../services/checkout";
import { createLibrary } from "../../services/library";
import {
  createDvlsForClients,
  createDvlsForCollaborators,
} from "../../services/dvl";
import DvlModel from "../../models/dvlModel";
import { CommissionModel } from "../../models/commissiomModel";
class Pagarme {
  private handleError(error: any, res: Response) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  //Função para desconetar o orm prisma
  private async handleDisconnect() {
    return await prisma?.$disconnect();
  }
  async createOrder(req: Request, res: Response) {
    try {
      const { cart, name, id, email } = req.body;
      const items = cart?.map((item: any) => {
        return {
          code: item.id,
          quantity: 1,
          amount: item.price + 8500,
          description: item.name,
        };
      });

      const totalAmount = items.reduce(
        (accumulator: any, currentValue: any) => {
          return accumulator + currentValue.amount;
        },
        0
      );

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Basic ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify({
          customer: {
            name: name,
            email: email,
          },
          items: items,

          payments: [
            {
              payment_method: "checkout",

              checkout: {
                expires_in: 108000,
                default_payment_method: "pix",
                accepted_payment_methods: ["pix", "credit_card"],
                success_url: "http://localhost:3000/sucess",
                skip_checkout_success_page: false,
                customer_editable: true,
                billing_address_editable: true,
                Pix: {
                  expires_in: 108000,
                },
                credit_card: {
                  installments: [
                    {
                      number: 1,
                      total: totalAmount + 10,
                    },
                    {
                      number: 2,
                      total: totalAmount,
                    },
                    {
                      number: 3,
                      total: totalAmount,
                    },
                    {
                      number: 4,
                      total: totalAmount,
                    },
                    {
                      number: 5,
                      total: totalAmount,
                    },
                  ],
                  statement_descriptor: "Plash",
                },
              },
            },
          ],

          closed: true,
          metadata: { id: id },
        }),
      };
      const request = await fetch(
        "https://api.pagar.me/core/v5/orders",
        options
      );
      const response = await request.json();

      const url = response?.checkouts[0]?.payment_url;
      return res.status(200).json(url);
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
  async webHook(req: Request, res: Response) {
    try {
      const data = req.body;

      if (data && data.status === "paid") {
        const ids = data.items.map((items: any) => parseInt(items.code));
        const getMagazines: any = await prisma?.magazines.findMany({
          where: {
            id: {
              in: ids,
            },
          },
          select: {
            author: true,
            company: true,
            Category: true,
            cover: true,
            model: true,
            magazine_pdf: true,
            description: true,
            name: true,
            employees: true,
            article: true,
            price: true,
          },
        });

        const articles = getMagazines.map((magazine: any) => magazine.article);
        const articleIds = articles.flat().map((article: any) => {
          return {
            name: article.name,
            cover: article.cover,
            volume: article.volume,
            author: article.author,
            description: "",
            company: article.company,
            articlepdf: "",
          };
        });

        Promise.all([
          createChekout(data, getMagazines),
          DvlModel.createDVL(data, getMagazines),
          CommissionModel.createDvlsForCollaborators(getMagazines),
          createLibrary(data, getMagazines, articleIds),
        ]);

        io.emit("newOrder", "Um novo Pedido foi solicitado");
        return res
          .status(200)
          .json({ message: "Pedido atualizado com sucesso!" });
      }
    } catch (error) {
      console.log(error);
      return this?.handleError(error, res);
    } finally {
      return this?.handleDisconnect();
    }
  }
}

const PagarmeController = new Pagarme();
export default PagarmeController;
