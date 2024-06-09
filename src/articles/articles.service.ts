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
    return this.prisma.article.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });
  }

  async getArticlesWithPagination(query) {
    const findManyArgs: any = {
      take: 9,
    };

    findManyArgs.where = {
      title: {
        contains: query.title,
        mode: 'insensitive',
      },
      description: {
        contains: query.description,
        mode: 'insensitive',
      },
      category: {
        contains: query.category,
      },
      createdAt: {
        gte: query.startDate
          ? new Date(query.startDate).toISOString()
          : undefined,
        lte: query.endDate ? new Date(query.endDate).toISOString() : undefined,
      },
    };

    findManyArgs.orderBy = {
      [query.sortBy]: query.sortOrder,
    };

    let page = 0;
    if (query.page) {
      page = query.page;
      findManyArgs.skip = +query.page * 9;
    }

    const totalPosts = await this.prisma.article.count();
    const totalPages = Math.floor(totalPosts / 9);

    const posts = await this.prisma.article.findMany(findManyArgs);

    return { posts, hasMore: page < totalPages, totalPages };
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
