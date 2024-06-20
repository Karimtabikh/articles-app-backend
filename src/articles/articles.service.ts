/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateFileDto } from 'src/files/dto/create-file.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article, Prisma } from '@prisma/client';
import { skip } from 'node:test';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createArticleDto: CreateArticleDto,
    files: Array<Express.Multer.File>,
  ) {
    const createdArticle = await this.prisma.article.create({
      data: createArticleDto,
    });

    const Filespromise = files.map((file) => {
      return this.prisma.file.create({
        data: { name: file.filename, articleId: createdArticle.id },
      });
    });

    await Promise.all(Filespromise);

    return createdArticle;
  }

  async getCategories() {
    const data = await this.prisma.article.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return data.map((e) => {
      return e.category;
    });
  }

  async getArticlesWithPagination(query) {
    let values = [];
    let childrenWhere = [];

    if (query.category && query.category.length > 0) {
      const categories = query.category.split(',');
      console.log(categories)
      childrenWhere.push(
        `category IN (${Prisma.join(categories, "::text")})`,
      );
    }


    let parentWhere = '';
    if (childrenWhere.length > 0) {
      parentWhere = `WHERE ${childrenWhere.join(' AND ')}`;
    }

    let orderBy = '';
    if (query.sortOrder) {
      orderBy = `ORDER BY title ${query.sortOrder}`;
    }

    let limit = 'LIMIT 9';
    let offset = '';
    let page = 0;
    if (query.page) {
      page = query.page;
      offset = `OFFSET ${query.page * 9}`;
    }

    const rawQuery = `SELECT "public"."Article"."id" FROM "public"."Article"`;
    // const rawQuery = `
    //   SELECT * FROM "Article"
    //   ${parentWhere}
    //   ${orderBy}
    //   ${limit}
    //   ${offset}
    // `;

    console.log(parentWhere);

    const posts = await this.prisma.$queryRaw`Select * FROM "Article" ${parentWhere}`;

    return posts;
  }

  // async getArticlesWithPagination(query) {

  //   let sql = `SELECT * FROM "Article"`;
  //   let countSql = `SELECT COUNT(*) FROM "Article"`;
  //   let whereClauses = [];
  //   let params = [];
  //   let paramIndex = 1;

  //   if (query.search) {
  //     whereClauses.push(
  //       `("title" ILIKE $${paramIndex} OR "description" ILIKE $${paramIndex})`,
  //     );
  //     params.push(`%${query.search}%`);
  //     paramIndex++;
  //   }

  //   if (query.startDate || query.endDate) {
  //     if (query.startDate) {
  //       whereClauses.push(`"createdAt" >= $${paramIndex}::timestamp`);
  //       params.push(query.startDate);
  //       paramIndex++;
  //     }
  //     if (query.endDate) {
  //       whereClauses.push(`"createdAt" <= $${paramIndex}::timestamp`);
  //       params.push(query.endDate);
  //       paramIndex++;
  //     }
  //   }

  //   if (query.category && query.category.length > 0) {
  //     const categories = query.category.split(',');
  //     whereClauses.push(
  //       `"category" IN (${categories.map((_, index) => `$${paramIndex + index}`).join(', ')})`,
  //     );
  //     params.push(...categories);
  //     paramIndex += categories.length;
  //   }

  //   if (whereClauses.length > 0) {
  //     sql += ` WHERE ${whereClauses.join(' AND ')}`;
  //     countSql += ` WHERE ${whereClauses.join(' AND ')}`;
  //   }

  //   sql += ` ORDER BY "title" ${query.sortOrder ? query.sortOrder.toUpperCase() : 'ASC'}`;
  //   sql += ` LIMIT 9 OFFSET $${paramIndex}`;
  //   params.push(query.page ? query.page * 9 : 0);

  //   const [posts, totalPosts] = await this.prisma.$transaction([
  //     this.prisma.$queryRawUnsafe(sql, ...params),
  //     this.prisma.$queryRawUnsafe(
  //       countSql,
  //       ...params.slice(0, params.length - 1),
  //     ),
  //   ]);

  //   const totalCount = Number(totalPosts[0].count);
  //   const totalPages = Math.floor(totalCount / 9);

  //   return { posts, hasMore: query.page < totalPages, totalPages };
  // }

  // async getArticlesWithPagination(query) {
  //   const findManyArgs: Prisma.ArticleFindManyArgs = {
  //     take: 9,
  //   };
  //   if (query.search) {
  //     findManyArgs.where = {
  //       OR: [
  //         {
  //           title: {
  //             contains: query.search ? query.search : undefined,
  //             mode: 'insensitive',
  //           },
  //         },
  //         {
  //           description: {
  //             contains: query.search ? query.search : undefined,
  //             mode: 'insensitive',
  //           },
  //         },
  //       ],
  //     };
  //   }

  //   if (query.startDate || query.endDate) {
  //     findManyArgs.where = {
  //       createdAt: {
  //         gte: !!query?.startDate ? query.startDate : undefined,
  //         lte: !!query?.endDate ? query.endDate : undefined,
  //       },
  //     };
  //   }

  //   if (query.category && query.category.length > 0) {
  //     findManyArgs.where = {
  //       category: {
  //         in: query.category ? query.category.split(',') : '',
  //       },
  //     };
  //   }

  //   findManyArgs.orderBy = {
  //     title: query.sortOrder,
  //   };

  //   let page = 0;
  //   if (query.page) {
  //     page = query.page;
  //     findManyArgs.skip = +query.page * 9;
  //   }

  //   const [posts, totalPosts] = await this.prisma.$transaction([
  //     this.prisma.article.findMany(findManyArgs),
  //     this.prisma.article.count({ where: findManyArgs.where }),
  //   ]);

  //   const updatePostsHtml = (posts) => {
  //     if (query.search) {
  //       const searchedTerm = query.search.toLowerCase().trim();
  //       const regExp = new RegExp(searchedTerm, 'ig');

  //       const filteredData = posts.map((post) => {
  //         let highlightedText = post.title;
  //         let highlightedDescription = post.description;
  //         let descriptionNeedsAdjust = false;

  //         if (post.title.toLowerCase().includes(searchedTerm)) {
  //           highlightedText = post.title.replace(
  //             regExp,
  //             "<mark class='bg-yellow-200'>$&</mark>",
  //           );
  //         }

  //         const postDescription = post.description.split(' ');
  //         const postDescriptionLowerCase = post.description
  //           .toLowerCase()
  //           .split(' ');
  //         const searchedTermIndex = postDescriptionLowerCase.findIndex(
  //           (postDescription) => postDescription.includes(searchedTerm),
  //         );

  //         if (searchedTermIndex !== -1) {
  //           const start = Math.max(searchedTermIndex - 5, 0);
  //           const end = Math.min(searchedTermIndex + 6, postDescription.length);

  //           const adjustedDescription = [
  //             start > 0 ? '...' : '',
  //             postDescription.slice(start, end).join(' '),
  //             end < postDescription.length ? '...' : '',
  //           ].join(' ');

  //           highlightedDescription = adjustedDescription.replace(
  //             regExp,
  //             "<mark class='bg-yellow-200'>$&</mark>",
  //           );

  //           console.log(highlightedDescription);
  //         }

  //         return {
  //           ...post,
  //           title: highlightedText,
  //           description: highlightedDescription,
  //           descriptionNeedsAdjust,
  //         };
  //       });

  //       posts = filteredData;
  //     }
  //     return posts;
  //   };

  //   const Updatedposts = updatePostsHtml(posts);

  //   const totalPages = Math.floor(totalPosts / 9);

  //   return { posts: Updatedposts, hasMore: page < totalPages, totalPages };
  // }

  getAllArticles() {
    return this.prisma.article.findMany();
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
