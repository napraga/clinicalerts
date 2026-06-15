import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';
import { Severity } from '../../domain/value-objects/severity.vo';
export interface UpdateAlertCommand {
    alertId: string;
    severity?: Severity;
    message?: string;
    isActive?: boolean;
}
export declare class UpdateAlertUseCase {
    private readonly repo;
    constructor(repo: alertRepositoryInterface.IAlertRepository);
    execute(command: UpdateAlertCommand): Promise<PatientAlert>;
}
