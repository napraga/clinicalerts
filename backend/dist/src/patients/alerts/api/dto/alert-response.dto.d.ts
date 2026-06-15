import { PatientAlert } from '../../domain/patient-alert.entity';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';
export declare class AlertResponseDto {
    id: string;
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    static fromDomain(alert: PatientAlert): AlertResponseDto;
}
