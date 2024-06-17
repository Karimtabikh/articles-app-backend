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
    const findManyArgs: Prisma.ArticleFindManyArgs = {
      take: 9,
    };
    if (query.search) {
      findManyArgs.where = {
        OR: [
          {
            title: {
              contains: query.search ? query.search : undefined,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query.search ? query.search : undefined,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (query.startDate || query.endDate) {
      findManyArgs.where = {
        createdAt: {
          gte: !!query?.startDate ? query.startDate : undefined,
          lte: !!query?.endDate ? query.endDate : undefined,
        },
      };
    }

    if (query.category && query.category.length > 0) {
      findManyArgs.where = {
        category: {
          in: query.category ? query.category.split(',') : '',
        },
      };
    }

    findManyArgs.orderBy = {
      title: query.sortOrder,
    };

    let page = 0;
    if (query.page) {
      page = query.page;
      findManyArgs.skip = +query.page * 9;
    }

    const [posts, totalPosts] = await this.prisma.$transaction([
      this.prisma.article.findMany(findManyArgs),
      this.prisma.article.count({ where: findManyArgs.where }),
    ]);

    const updatePostsHtml = (posts) => {
      if (query.search) {
        const searchedTerm = query.search.toLowerCase().trim();
        const regExp = new RegExp(searchedTerm, 'ig');

        const filteredData = posts.map((post) => {
          let highlightedText = post.title;
          let highlightedDescription = post.description;
          let descriptionNeedsAdjust = false;

          if (post.title.toLowerCase().includes(searchedTerm)) {
            highlightedText = post.title.replace(
              regExp,
              "<mark class='bg-yellow-200'>$&</mark>",
            );
          }

          if (post.description.toLowerCase().includes(searchedTerm)) {
            highlightedDescription = post.description.replace(
              regExp,
              "<mark class='bg-yellow-200'>$&</mark>",
            );
          }
          // Check if the term is beyond the first 3 lines
          const searchedDescription = post.description.split(' ').join(" ");
          console.log(searchedDescription);

          return {
            ...post,
            title: highlightedText,
            description: highlightedDescription,
            descriptionNeedsAdjust,
          };
        });

        posts = filteredData;
      }
      return posts;
    };

    const Updatedposts = updatePostsHtml(posts);

    const totalPages = Math.floor(totalPosts / 9);

    return { posts: Updatedposts, hasMore: page < totalPages, totalPages };
  }

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
