// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { Article } from 'src/articles/entities/article.entity';

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
      category: 'test',
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      category: 'test 1',
    },
  });

  const file1 = await prisma.articleFile.upsert({
    where: { path: 'path1' },
    update: { articleId: post1.id },
    create: {
      name: 'dummy-profile-pic-300x300-1',
      path: 'path1',
    },
  });

  const file2 = await prisma.articleFile.upsert({
    where: { path: 'path2' },
    update: { articleId: post2.id },
    create: {
      name: 'dummy-profile-pic-300x300-2',
      path: 'path2',
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
