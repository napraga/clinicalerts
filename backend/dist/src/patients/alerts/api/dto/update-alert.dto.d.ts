import { Severity } from '../../domain/value-objects/severity.vo';
export declare class UpdateAlertDto {
    severity?: Severity;
    message?: string;
    isActive?: boolean;
}
