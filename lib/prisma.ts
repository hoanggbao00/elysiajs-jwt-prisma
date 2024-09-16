import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production')
	globalThis.prismaGlobal = prisma;
