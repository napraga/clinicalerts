import { Inject, Injectable } from '@nestjs/common';
import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';
import { AlertDuplicateError } from '../../domain/errors/alert-duplicate.error';

export interface CreateAlertCommand {
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
}

@Injectable()
export class CreateAlertUseCase {
    constructor(
        @Inject(alertRepositoryInterface.ALERT_REPOSITORY)
        private readonly repo: alertRepositoryInterface.IAlertRepository,
    ) { }

    async execute(command: CreateAlertCommand): Promise<PatientAlert> {
        // ─── Regla de negocio central — vive aquí, no en el controlador ──────
        const duplicate = await this.repo.findDuplicate(
            command.patientId,
            command.type,
            command.message,
        );

        if (duplicate) {
            throw new AlertDuplicateError(command.patientId);
        }
        // ─────────────────────────────────────────────────────────────────────

        const alert = PatientAlert.create({
            patientId: command.patientId,
            type: command.type,
            severity: command.severity,
            message: command.message,
        });

        return this.repo.save(alert);
    }
}