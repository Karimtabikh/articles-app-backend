// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      category: 'Health',
      
      reference: ['Test'],
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      category: 'Tech',
      reference: ['Test 2'],
    },
  });

  const file1 = await prisma.file.upsert({
    where: { name: 'file1' },
    update: { articleId: post1.id },
    create: {
      name: 'file1',
      articleId: post1.id,
    },
  });

  const file2 = await prisma.file.upsert({
    where: { name: 'file2' },
    update: { articleId: post2.id },
    create: {
      name: 'file2',
      articleId: post2.id,
    },
  });

  console.log({ post1, post2, file1, file2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
