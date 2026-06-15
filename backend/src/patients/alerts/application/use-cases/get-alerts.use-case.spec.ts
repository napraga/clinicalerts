import { GetAlertsUseCase } from './get-alerts.use-case';
import { PatientAlert } from '../../domain/patient-alert.entity';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';

const mockRepo = {
    findByPatient: jest.fn(),
    findById: jest.fn(),
    findDuplicate: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const makeAlert = (isActive: boolean) =>
    new PatientAlert(
        crypto.randomUUID(),
        'patient-1',
        AlertType.ALLERGY,
        Severity.HIGH,
        'Alergia a la penicilina',
        isActive,
        new Date(),
        new Date(),
    );

describe('GetAlertsUseCase', () => {
    let useCase: GetAlertsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetAlertsUseCase(mockRepo);
    });

    it('devuelve las alertas del paciente en el orden del repositorio', async () => {
        const alerts = [makeAlert(true), makeAlert(true), makeAlert(false)];
        mockRepo.findByPatient.mockResolvedValue(alerts);

        const result = await useCase.execute('patient-1');

        expect(mockRepo.findByPatient).toHaveBeenCalledWith('patient-1');
        expect(result).toHaveLength(3);
    });

    it('devuelve array vacío si el paciente no tiene alertas', async () => {
        mockRepo.findByPatient.mockResolvedValue([]);

        const result = await useCase.execute('patient-1');

        expect(result).toEqual([]);
    });
});