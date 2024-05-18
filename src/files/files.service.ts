import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  create(createFileDto: CreateFileDto) {
    return this.prisma.file.create({ data: createFileDto });
  }

  findAll() {
    return this.prisma.file.findMany();
  }

  findOne(id: number) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return this.prisma.file.update({ where: { id }, data: updateFileDto });
  }

  remove(id: number) {
    return this.prisma.file.delete({ where: { id } });
  }
}
