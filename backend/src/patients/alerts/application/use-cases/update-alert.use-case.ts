import { Inject, Injectable } from '@nestjs/common';
import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { PatientAlert } from '../../domain/patient-alert.entity';
import { Severity } from '../../domain/value-objects/severity.vo';
import { AlertNotFoundError } from '../../domain/errors/alert-not-found.error';
import { AlertDuplicateError } from '../../domain/errors/alert-duplicate.error';

export interface UpdateAlertCommand {
    alertId: string;
    severity?: Severity;
    message?: string;
    isActive?: boolean;
}

@Injectable()
export class UpdateAlertUseCase {
    constructor(
        @Inject(alertRepositoryInterface.ALERT_REPOSITORY)
        private readonly repo: alertRepositoryInterface.IAlertRepository,
    ) { }

    async execute(command: UpdateAlertCommand): Promise<PatientAlert> {
        const alert = await this.repo.findById(command.alertId);

        if (!alert) {
            throw new AlertNotFoundError(command.alertId);
        }

        // Si se intenta reactivar, verificar que no genere duplicado
        if (command.isActive === true && !alert.isActive) {
            const duplicate = await this.repo.findDuplicate(
                alert.patientId,
                alert.type,
                command.message ?? alert.message,
            );

            if (duplicate && duplicate.id !== alert.id) {
                throw new AlertDuplicateError(alert.patientId);
            }
        }

        // Aplicar cambios sobre la entidad
        const updated = new PatientAlert(
            alert.id,
            alert.patientId,
            alert.type,
            command.severity ?? alert.severity,
            command.message ?? alert.message,
            command.isActive ?? alert.isActive,
            alert.createdAt,
            new Date(),
        );

        return this.repo.update(updated);
    }
}