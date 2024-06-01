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

  async getArticlesWithPagination(cursor?: number) {
    const findManyArgs: any = {
      take: 9,
      // include: {
      //   files: true,
      // },
    };

    if (cursor) {
      findManyArgs.cursor = {
        id: cursor,
      };
      findManyArgs.skip = 1;
    }

    const [data, totalArticles] = await Promise.all([
      // this.prisma.article.findMany(findManyArgs),
      this.prisma.article.findMany(findManyArgs),
      this.prisma.article.count(),
    ]);

    const nextId = cursor < totalArticles ? data[data.length - 1].id + 1 : null;
    return { data, nextId };
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
