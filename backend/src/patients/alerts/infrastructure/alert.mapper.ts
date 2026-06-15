import { Prisma, PatientAlert as PrismaAlert } from '@prisma/client';
import { PatientAlert } from '../domain/patient-alert.entity';
import { AlertType } from '../domain/value-objects/alert-type.vo';
import { Severity } from '../domain/value-objects/severity.vo';

export class AlertMapper {
    static toDomain(record: PrismaAlert): PatientAlert {
        return new PatientAlert(
            record.id,
            record.patientId,
            record.type as AlertType,
            record.severity as Severity,
            record.message,
            record.isActive,
            record.createdAt,
            record.updatedAt,
        );
    }

    static toPrisma(
        alert: PatientAlert,
    ): Prisma.PatientAlertCreateInput {
        return {
            id: alert.id,
            patientId: alert.patientId,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            isActive: alert.isActive,
        };
    }
}