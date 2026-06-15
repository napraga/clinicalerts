import { PatientAlert } from '../../domain/patient-alert.entity';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';

export class AlertResponseDto {
    id: string;
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    static fromDomain(alert: PatientAlert): AlertResponseDto {
        const dto = new AlertResponseDto();
        dto.id = alert.id;
        dto.patientId = alert.patientId;
        dto.type = alert.type;
        dto.severity = alert.severity;
        dto.message = alert.message;
        dto.isActive = alert.isActive;
        dto.createdAt = alert.createdAt.toISOString();
        dto.updatedAt = alert.updatedAt.toISOString();
        return dto;
    }
}