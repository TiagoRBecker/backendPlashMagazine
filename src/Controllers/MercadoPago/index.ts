/*import { Request, Response, response } from "express";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
const mercadoPago = new MercadoPagoConfig({
  accessToken:
    "TEST-39555372415078-021907-2422d99568f793ba1e5e5df646ede4b8-829777433",
});
const preference = new Preference(mercadoPago);
const payment = new Payment(mercadoPago);
const GatwayPayment = async (req: Request, res: Response) => {
  const { cart } = req.body;

  const items = cart.map((items: any) => {
    return {
      id: items.id,
      title: items.name,
      unit_price: items.price,
      currency_id: "BRL",
      picture_url:items.cover[0],
       
      quantity:1,
    };
  });

  try {
    const createPreference = await preference.create({
      body: {
        back_urls: {
          success: "http://localhost:3000/sucess",
          failure: "http://localhost:3000/failure",
        },
        items: items,

        payment_methods: {
          installments: 4,
          excluded_payment_types: [
            {
              id: "ticket",
            },
          ],
        },
        auto_return: "approved",
        metadata: {
          userID: 1,
          products: items,
        },
      },
    });

    return res.status(200).json({ id: createPreference.id });
  } catch (error) {
    console.log(error);
  }
  
};
export const WebHook = async (req: Request, res: Response) => {
  const { data } = req.body;

  if (data.id) {
    try {
      const getStatus = await payment.get({ id: data.id });
      const satusPayment = getStatus.status;
      const metadata = getStatus.metadata;

      if (satusPayment === "approved") {
        const createOrder = await prisma?.order.create({
          data: {
           
            items: metadata.products,
            userId: metadata.user_id,
          },
        });
        const dvlItems = getStatus.metadata.products.map((items: any) => {
          return {
            name: items.title,
            price: items.unit_price,
            toReceive: 0,
            picture: items.picture_url,
            paidOut: items.unit_price,
            userId: metadata.user_id,
          };
        });
        const createDvlItems = await prisma?.dvl.createMany({
          data: dvlItems,
        });
        console.log(createDvlItems);
        return res.status(200).json({ message: "Order criada com sucesso" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const CreateOrder = async (req: Request, res: Response) => {
  const getOrder = await payment.get({ id: "1320964195" });
  try {
    const satusPayment = getOrder.status;
    const metadata = getOrder.metadata;
    if (satusPayment === "approved") {
      const createOrder = await prisma?.order.create({
        data: {
          
          items: metadata.products,
          userId: 1,
        },
      });
      const dvlItems = metadata.products.map((items: any) => {
        return {
          name: items.title,
          price: items.unit_price,
          toReceive: 0,
          picture: items.picture_url,
          paidOut: items.unit_price,
          userId: metadata.user_id,
        };
      });
      const createDvlItems = await prisma?.dvl.createMany({
        data: dvlItems,
      });

      const userId = 1; // Substitua pelo ID do usuário desejado
      const novaRevista = {
        " name": "Nova Revista",
        " teste": "Nova Revista",
        " article": "Nova Revista",
         "pdf": "url_do_pdf_da_revista",
      };
        const teste = ["arra de sting"]
      const usuario = await prisma?.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          library: true,  // Inclua a biblioteca do usuário na consulta
        },
      });
      
      if (usuario) {
      const userCreate = await prisma?.user.update({
        where:{
          id:1
        },
        data:{
          library:{
      
           create:{
            author:"Leonardo",
            cover:["https://plashmagazine.s3.sa-east-1.amazonaws.com/4-039e3b82-6b05-4c07-9229-09fb6e88e807.png"],
            magazine_pdf:"https://plashmagazine.s3.sa-east-1.amazonaws.com/vol4-tiopiks-b5c7546d-6440-4c5f-a4d6-5ab702df0d0f.pdf",
            name:"Skate na veia 4",
            categoryId:1
            
           },
       
          }
        }
       
      })
      return res.status(200).json(userCreate)
  }

}
  }
 catch (error) {
    console.log(error);
  }
};

export default GatwayPayment;
*/