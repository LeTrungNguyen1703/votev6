import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DB } from '../../database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Prefer the connection string from the Encore `DB` object, then fall back to the
    // environment variable. Only include the `datasources` override when we actually
    // have a URL; otherwise let Prisma read from process.env as usual.
    const datasourceUrl = DB?.connectionString ?? process.env.DATABASE_URL;

    const prismaOptions: any = {
      log: ['query', 'info', 'warn', 'error'],
    };

    if (datasourceUrl) {
      prismaOptions.datasources = {
        db: {
          url: datasourceUrl,
        },
      };
    }

    super(prismaOptions);
  }

  async onModuleInit() {
    try {
      this.logger.log(`Using DB.connectionString: ${DB.connectionString ?? process.env.DATABASE_URL}`);
      await this.$connect();
      // Run a lightweight connectivity check
      try {
        // Use a raw query that works on Postgres
        // Type is any because $queryRaw returns unknown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (this as any).$queryRaw`SELECT 1 as ok`;
        this.logger.log(`Database connectivity test result: ${JSON.stringify(res)}`);
      } catch (pingErr) {
        this.logger.warn('Connectivity test failed after successful connect', pingErr as Error);
      }

      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error as Error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }
}