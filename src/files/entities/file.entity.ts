import { File } from '@prisma/client';

export class FileEntity implements File {
  id: number;
  name: string;
  path: string;
}
