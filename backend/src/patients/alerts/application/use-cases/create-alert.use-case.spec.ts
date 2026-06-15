import { CreateAlertUseCase } from './create-alert.use-case';
import { AlertDuplicateError } from '../../domain/errors/alert-duplicate.error';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';
import { PatientAlert } from '../../domain/patient-alert.entity';

const makeCommand = () => ({
    patientId: 'patient-1',
    type: AlertType.ALLERGY,
    severity: Severity.HIGH,
    message: 'Alergia a la penicilina',
});

const mockRepo = {
    findByPatient: jest.fn(),
    findById: jest.fn(),
    findDuplicate: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe('CreateAlertUseCase', () => {
    let useCase: CreateAlertUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new CreateAlertUseCase(mockRepo);
    });

    it('crea una alerta cuando no existe duplicado activo', async () => {
        mockRepo.findDuplicate.mockResolvedValue(null);
        mockRepo.save.mockImplementation((alert: PatientAlert) =>
            Promise.resolve(alert),
        );

        const result = await useCase.execute(makeCommand());

        expect(mockRepo.findDuplicate).toHaveBeenCalledWith(
            'patient-1',
            AlertType.ALLERGY,
            'Alergia a la penicilina',
        );
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
        expect(result.isActive).toBe(true);
        expect(result.patientId).toBe('patient-1');
    });

    it('lanza AlertDuplicateError si ya existe una alerta activa idéntica', async () => {
        const existing = PatientAlert.create(makeCommand());
        mockRepo.findDuplicate.mockResolvedValue(existing);

        await expect(useCase.execute(makeCommand())).rejects.toThrow(
            AlertDuplicateError,
        );

        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('la alerta creada nace con isActive true', async () => {
        mockRepo.findDuplicate.mockResolvedValue(null);
        mockRepo.save.mockImplementation((a: PatientAlert) => Promise.resolve(a));

        const result = await useCase.execute(makeCommand());

        expect(result.isActive).toBe(true);
    });
});