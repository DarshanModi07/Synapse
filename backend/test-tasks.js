import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const tasks = await prisma.task.findMany({
        select: { id: true, title: true, projectTeamId: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });
    console.log('Latest 10 tasks:', tasks);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
