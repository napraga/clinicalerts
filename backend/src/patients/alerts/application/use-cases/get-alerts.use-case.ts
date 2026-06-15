import { Inject, Injectable } from '@nestjs/common';
import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';

@Injectable()
export class GetAlertsUseCase {
    constructor(
        @Inject(alertRepositoryInterface.ALERT_REPOSITORY)
        private readonly repo: alertRepositoryInterface.IAlertRepository,
    ) { }

    async execute(patientId: string): Promise<PatientAlert[]> {
        return this.repo.findByPatient(patientId);
        // El repositorio ya ordena: activas primero, luego por fecha desc
    }
}