import { Inject, Injectable } from '@nestjs/common';
import * as alertRepositoryInterface from '../../domain/alert.repository.interface';
import { AlertNotFoundError } from '../../domain/errors/alert-not-found.error';

@Injectable()
export class DeleteAlertUseCase {
    constructor(
        @Inject(alertRepositoryInterface.ALERT_REPOSITORY)
        private readonly repo: alertRepositoryInterface.IAlertRepository,
    ) { }

    async execute(alertId: string): Promise<void> {
        const alert = await this.repo.findById(alertId);

        if (!alert) {
            throw new AlertNotFoundError(alertId);
        }

        await this.repo.delete(alertId);
    }
}