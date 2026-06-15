import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { GetAlertsUseCase } from '../application/use-cases/get-alerts.use-case';
import { CreateAlertUseCase } from '../application/use-cases/create-alert.use-case';
import { UpdateAlertUseCase } from '../application/use-cases/update-alert.use-case';
import { DeleteAlertUseCase } from '../application/use-cases/delete-alert.use-case';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertResponseDto } from './dto/alert-response.dto';
import { AlertDuplicateError } from '../domain/errors/alert-duplicate.error';
import { AlertNotFoundError } from '../domain/errors/alert-not-found.error';

@Controller()
export class PatientAlertsController {
    constructor(
        private readonly getAlerts: GetAlertsUseCase,
        private readonly createAlert: CreateAlertUseCase,
        private readonly updateAlert: UpdateAlertUseCase,
        private readonly deleteAlert: DeleteAlertUseCase,
    ) { }

    // GET /patients/:patientId/alerts
    @Get('patients/:patientId/alerts')
    async findAll(
        @Param('patientId', ParseUUIDPipe) patientId: string,
    ): Promise<AlertResponseDto[]> {
        const alerts = await this.getAlerts.execute(patientId);
        return alerts.map(AlertResponseDto.fromDomain);
    }

    // POST /patients/:patientId/alerts
    @Post('patients/:patientId/alerts')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Param('patientId', ParseUUIDPipe) patientId: string,
        @Body() dto: CreateAlertDto,
    ): Promise<AlertResponseDto> {
        try {
            const alert = await this.createAlert.execute({ patientId, ...dto });
            return AlertResponseDto.fromDomain(alert);
        } catch (e) {
            if (e instanceof AlertDuplicateError) {
                throw new ConflictException(e.message);
            }
            throw e;
        }
    }

    // PATCH /patient-alerts/:alertId
    @Patch('patient-alerts/:alertId')
    async update(
        @Param('alertId', ParseUUIDPipe) alertId: string,
        @Body() dto: UpdateAlertDto,
    ): Promise<AlertResponseDto> {
        try {
            const alert = await this.updateAlert.execute({ alertId, ...dto });
            return AlertResponseDto.fromDomain(alert);
        } catch (e) {
            if (e instanceof AlertNotFoundError) {
                throw new NotFoundException(e.message);
            }
            if (e instanceof AlertDuplicateError) {
                throw new ConflictException(e.message);
            }
            throw e;
        }
    }

    // DELETE /patient-alerts/:alertId
    @Delete('patient-alerts/:alertId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('alertId', ParseUUIDPipe) alertId: string,
    ): Promise<void> {
        try {
            await this.deleteAlert.execute(alertId);
        } catch (e) {
            if (e instanceof AlertNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }
}