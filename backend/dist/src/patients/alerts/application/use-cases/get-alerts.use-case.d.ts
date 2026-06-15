import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';
export declare class GetAlertsUseCase {
    private readonly repo;
    constructor(repo: alertRepositoryInterface.IAlertRepository);
    execute(patientId: string): Promise<PatientAlert[]>;
}
