import prisma from "../server/prisma";

export const createLibrary = async (data: any, magazines: any, articleIds: any) => {
  try {
    const library = magazines?.map((item: any) => {
      return {
        name: item.name,
        author: item.author,
        magazine_pdf: item.magazine_pdf,
        cover: item.cover,
        model: item.model
      };
    });

    for (const item of library) {
      if (item.model === "Digital") {
       
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
                cover: item.cover

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