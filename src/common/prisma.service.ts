import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaClient, Prisma } from '@prisma/client';
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  // Prisma service implementation
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'query' },
      ],
    });
  }

  onModuleInit() {
    this.$on('query', (e) => {
      this.logger.info(e);
    });
    this.$on('error', (e) => {
      this.logger.error('Prisma error:', e);
    });
    this.$on('info', (e) => {
      this.logger.info('Prisma info:', e);
    });
    this.$on('warn', (e) => {
      this.logger.warn('Prisma warning:', e);
    });
    // try {
    //   await this.$connect();
    //   this.logger.info('✅ Prisma connected to MySQL');
    // } catch (error) {
    //   this.logger.error('❌ Prisma connection error:', error);
    //   throw error;
    // }
  }

  // async onModuleDestroy() {
  //   await this.$disconnect();
  //   console.log('🔌 Prisma disconnected from MySQL');
  // }
}
