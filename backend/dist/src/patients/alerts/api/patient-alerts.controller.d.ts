import { GetAlertsUseCase } from '../application/use-cases/get-alerts.use-case';
import { CreateAlertUseCase } from '../application/use-cases/create-alert.use-case';
import { UpdateAlertUseCase } from '../application/use-cases/update-alert.use-case';
import { DeleteAlertUseCase } from '../application/use-cases/delete-alert.use-case';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertResponseDto } from './dto/alert-response.dto';
export declare class PatientAlertsController {
    private readonly getAlerts;
    private readonly createAlert;
    private readonly updateAlert;
    private readonly deleteAlert;
    constructor(getAlerts: GetAlertsUseCase, createAlert: CreateAlertUseCase, updateAlert: UpdateAlertUseCase, deleteAlert: DeleteAlertUseCase);
    findAll(patientId: string): Promise<AlertResponseDto[]>;
    create(patientId: string, dto: CreateAlertDto): Promise<AlertResponseDto>;
    update(alertId: string, dto: UpdateAlertDto): Promise<AlertResponseDto>;
    remove(alertId: string): Promise<void>;
}
