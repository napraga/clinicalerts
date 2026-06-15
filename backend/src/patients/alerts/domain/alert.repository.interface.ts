import { PatientAlert } from './patient-alert.entity';
import { AlertType } from './value-objects/alert-type.vo';

export const ALERT_REPOSITORY = Symbol('IAlertRepository');

export interface IAlertRepository {
    findByPatient(patientId: string): Promise<PatientAlert[]>;
    findById(id: string): Promise<PatientAlert | null>;
    findDuplicate(
        patientId: string,
        type: AlertType,
        message: string,
    ): Promise<PatientAlert | null>;
    save(alert: PatientAlert): Promise<PatientAlert>;
    update(alert: PatientAlert): Promise<PatientAlert>;
    delete(id: string): Promise<void>;
}