import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma || new PrismaClient()

//check if we are running in production mode
if (process.env.NODE_ENV !== 'production') {
     global.prisma = prismaClient
} 
export default prisma