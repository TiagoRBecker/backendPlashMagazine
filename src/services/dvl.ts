import prisma from "../server/prisma";
export const createDvlsForCollaborators = async(magazines:any)=> {
   
    
    for (const magazine of magazines) {
        for (const employee of magazine.employees) {
    
          
            const createdDvl = await prisma?.dvls_Employee.create({
                data: {
                    name: magazine.name,
                    price: magazine.price,
                    picture: magazine.cover[0],
                    paidOut: Math.round(Number(magazine.price * employee.commission) * 100) / 100,
                    toReceive: 0,
                    employee: { connect: { id: employee.id } },
                },
            });
            

           
        }
    }
}

export const createDvlsForClients = async(data:any,magazines:any)=> {
   
    const dvl = magazines?.map((items: any) => {
        return {
          name: items.name,
          price: items.price,
          picture: items.cover[0],
          paidOut: Number(items.price * 2),
          toReceive: 0,
          userId: Number(data.metadata.id),
        };
      });
      for (const item of dvl as any) {
        const dvl = await prisma?.dvls.create({
          data: item,
        });
      }
        
       console.log("Dvl criado com sucesso!")
}
