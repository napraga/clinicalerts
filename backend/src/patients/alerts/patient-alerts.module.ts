import { Module } from '@nestjs/common';
import { PatientAlertsController } from './api/patient-alerts.controller';
import { GetAlertsUseCase } from './application/use-cases/get-alerts.use-case';
import { CreateAlertUseCase } from './application/use-cases/create-alert.use-case';
import { UpdateAlertUseCase } from './application/use-cases/update-alert.use-case';
import { DeleteAlertUseCase } from './application/use-cases/delete-alert.use-case';
import { PrismaAlertRepository } from './infrastructure/prisma-alert.repository';
import { ALERT_REPOSITORY } from './domain/alert.repository.interface';

@Module({
  controllers: [PatientAlertsController],
  providers: [
    // Casos de uso
    GetAlertsUseCase,
    CreateAlertUseCase,
    UpdateAlertUseCase,
    DeleteAlertUseCase,

    // Binding: el Symbol del dominio apunta a la implementación Prisma
    {
      provide: ALERT_REPOSITORY,
      useClass: PrismaAlertRepository,
    },
  ],
})
export class PatientAlertsModule { }