import prisma from "../server/prisma";
export const FindMgazines = async (ids:[number])=>{
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
      subCategory:true,
    },
  });
  return getMagazines
}
export const createLibrary = async (data: any, magazines: any, articleIds: any) => {

  try {
   
   

    for (const item of magazines) {
      if (item.model === "Digital" || item.model === "digital") {
       
        await prisma?.users.update({
          where: {
            id: Number(data?.metadata.id),
          },
          data: {
            library: {
              create:{
                name: item.name,
                author: item.author,
                magazine_pdf: item.magazine_pdf,
                cover: item.cover,
                subCategory:item.subCategory,


              }
            },
          },
        });
        

        console.log("Revista adicionada com sucesso");
      }
    }
  } catch (error) {
    console.log(error);
  }
};