import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PatientAlertsModule } from './patients/alerts/patient-alerts.module';

@Module({
  imports: [PrismaModule, PatientAlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
