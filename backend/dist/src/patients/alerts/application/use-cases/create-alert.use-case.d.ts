import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';
export interface CreateAlertCommand {
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
}
export declare class CreateAlertUseCase {
    private readonly repo;
    constructor(repo: alertRepositoryInterface.IAlertRepository);
    execute(command: CreateAlertCommand): Promise<PatientAlert>;
}
