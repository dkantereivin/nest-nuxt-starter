import { Prisma, PrismaClient, User } from '@prisma/client';
import { internet } from 'faker';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const rawQueries = [];

export const seed = async () => {
    await prisma.$connect();
    rawQueries.forEach((query) => {
        prisma.$executeRaw(query)
    });

    const users = await seedUsers(100);
    console.log(`Seeded ${users.length} users.`);
}

export const seedUsers = async (cnt: number): Promise<User[]> => {
    const user = async (): Promise<Prisma.UserCreateInput> => ({
        email: internet.email(),
        username: internet.userName(),
        password: await hash(internet.password(), 8)
    });

    const users = await Promise.all(Array.from(
        {length: cnt},
        () => user()
    ));

    await prisma.user.createMany({
        data: users
    });

    return prisma.user.findMany();
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
