import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  // constructor() {
  //   super({
  //     log: [
  //       { emit: 'stdout', level: 'query' },
  //       { emit: 'stdout', level: 'info' },
  //       { emit: 'stdout', level: 'warn' },
  //       { emit: 'stdout', level: 'error' },
  //     ],
  //     errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
  //   });

  //   this.$on('query', (e) => {
  //     console.log('Query: ' + e.query);
  //     console.log('Params: ' + e.params);
  //     console.log('Duration: ' + e.duration + 'ms');
  //   });
  // }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      Logger.error(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
