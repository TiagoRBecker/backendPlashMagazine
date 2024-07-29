import prisma from "../server/prisma";
export const createChekout = async (data:any,magazines:any)=> {
 try {
  const items = magazines?.map((items: any) => {
    return {
      id: items.id,
      title: items.name,
      picture_url: items.cover,
      unit_price: items.price,
      model: items.model,
      quantity: 1,
    };
  });
  
  const createOrder = await prisma?.orders.create({
    data: {
      items: items,
      street_number: data.charges[0].customer.address.number,
      name:data.charges[0].customer.name,
      email:data.charges[0].customer.email,
      amout: data.amount,
      city: data.charges[0].customer.address.city,
      complement: data.charges[0].customer.address.complement,
      country: data.charges[0].customer.address.country,
      phone: `${data.charges[0].customer.phones.mobile_phone.area_code} ${data.charges[0].customer.phones.mobile_phone.number} `,
      state: data.charges[0].customer.address.state,
      street: data.charges[0].customer.address.street,
      neighborhood: data.charges[0].customer.address.neighborhood,
      zip_code: data.charges[0].customer.address.zip_code,
      userId: Number(data.metadata.id),
    },
  });
  
   console.log("Checkout criado  com sucesso")
 } catch (error) {
    console.log(error)

 }
  
   
}