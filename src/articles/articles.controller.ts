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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

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

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createArticleDto: CreateArticleDto,
  // ) {
  //   if (file) {
  //     createArticleDto.filePath = file.path;
  //     console.log(file);
  //   }
  //   // return this.articlesService.create(createArticleDto);
  // }

  @Get()
  findAll() {
    return this.articlesService.findAll();
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
