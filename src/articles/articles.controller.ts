/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { stringify } from 'querystring';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files[]', 10, { dest: './uploads' }))
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.articlesService.create(createArticleDto, files);
  }

  @Get()
  getArticlesWithPagination(@Query() query) {
    return this.articlesService.getArticlesWithPagination(query);
  }

  @Get('all')
  getAllArticles() {
    return this.articlesService.getAllArticles();
  }

  @Get('categories')
  getArticlesCategories() {
    return this.articlesService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
