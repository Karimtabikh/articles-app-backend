import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [PrismaModule, ArticlesModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
