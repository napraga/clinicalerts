import { AlertType } from './value-objects/alert-type.vo';
import { Severity } from './value-objects/severity.vo';
export interface CreateAlertProps {
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
}
export declare class PatientAlert {
    readonly id: string;
    readonly patientId: string;
    readonly type: AlertType;
    readonly severity: Severity;
    readonly message: string;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, patientId: string, type: AlertType, severity: Severity, message: string, isActive: boolean, createdAt: Date, updatedAt: Date);
    static create(props: CreateAlertProps): PatientAlert;
    activate(): void;
    deactivate(): void;
    toggle(): void;
    isSameAlertAs(other: PatientAlert): boolean;
    isHighSeverity(): boolean;
}
