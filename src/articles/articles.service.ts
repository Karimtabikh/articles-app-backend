import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateFileDto } from 'src/files/dto/create-file.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article, Prisma } from '@prisma/client';

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
    // http://localhost:3000/articles?category=technology&startDate=2024-06-01&endDate=2024-06-5&title=re&description=ov&sortBy=createdAt&sortOrder=desc

    const findManyArgs: any = {
      // take: 9,
    };

    // if (query.cursor) {
    //   findManyArgs.cursor = {
    //     id: +query.cursor,
    //   };
    //   findManyArgs.skip = 1;
    // }

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

    console.log(findManyArgs);

    const [data, totalArticles] = await Promise.all([
      this.prisma.article.findMany(findManyArgs),
      this.prisma.article.count(),
    ]);

    // const nextId =
    // query.cursor < totalArticles ? data[data.length - 1].id + 1 : null;
    // return { data, nextId };
    return { data };
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
