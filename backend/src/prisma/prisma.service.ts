import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';;

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'error' },
                { emit: 'stdout', level: 'warn' },
            ],
        });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
        this.logger.log('Prisma conectado a la base de datos');

        // Log de queries solo en desarrollo
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore — el tipo de $on('query') varía según la versión de Prisma
            this.$on('query', (e: { query: string; duration: number }) => {
                this.logger.debug(`Query: ${e.query} — ${e.duration}ms`);
            });
        }
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
        this.logger.log('Prisma desconectado');
    }

    /**
     * Útil para tests: limpia todas las tablas en orden seguro
     * según las relaciones FK definidas en el schema.
     */
    async cleanDatabase(): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('cleanDatabase no puede ejecutarse en producción');
        }

        const tableNames = ['PatientAlert'];

        for (const table of tableNames) {
            await this.$executeRawUnsafe(`DELETE FROM "${table}";`);
        }
    }
}