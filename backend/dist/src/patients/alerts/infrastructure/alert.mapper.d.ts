import { Prisma, PatientAlert as PrismaAlert } from '@prisma/client';
import { PatientAlert } from '../domain/patient-alert.entity';
export declare class AlertMapper {
    static toDomain(record: PrismaAlert): PatientAlert;
    static toPrisma(alert: PatientAlert): Prisma.PatientAlertCreateInput;
}
