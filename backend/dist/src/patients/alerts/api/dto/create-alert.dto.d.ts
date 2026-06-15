import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';
export declare class CreateAlertDto {
    type: AlertType;
    severity: Severity;
    message: string;
}
