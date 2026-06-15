import { PrismaService } from '../../../prisma/prisma.service';
import { IAlertRepository } from '../domain/alert.repository.interface';
import { PatientAlert } from '../domain/patient-alert.entity';
export declare class PrismaAlertRepository implements IAlertRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByPatient(patientId: string): Promise<PatientAlert[]>;
    findById(id: string): Promise<PatientAlert | null>;
    findDuplicate(patientId: string, type: string, message: string): Promise<PatientAlert | null>;
    save(alert: PatientAlert): Promise<PatientAlert>;
    update(alert: PatientAlert): Promise<PatientAlert>;
    delete(id: string): Promise<void>;
}
