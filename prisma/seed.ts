import { Prisma, PrismaClient, User } from '@prisma/client';
import faker  from '@faker-js/faker';
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
        active: Math.random() < 0.8,
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: await hash(faker.internet.password(), 8)
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
