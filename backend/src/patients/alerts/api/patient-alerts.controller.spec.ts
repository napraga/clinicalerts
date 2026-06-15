import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PatientAlertsController } from './patient-alerts.controller';
import { GetAlertsUseCase } from '../application/use-cases/get-alerts.use-case';
import { CreateAlertUseCase } from '../application/use-cases/create-alert.use-case';
import { UpdateAlertUseCase } from '../application/use-cases/update-alert.use-case';
import { DeleteAlertUseCase } from '../application/use-cases/delete-alert.use-case';
import { AlertType } from '../domain/value-objects/alert-type.vo';
import { Severity } from '../domain/value-objects/severity.vo';
import { PatientAlert } from '../domain/patient-alert.entity';
import { AlertDuplicateError } from '../domain/errors/alert-duplicate.error';

const PATIENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const ALERT_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

const makeAlert = () =>
    new PatientAlert(
        ALERT_ID,
        PATIENT_ID,
        AlertType.ALLERGY,
        Severity.HIGH,
        'Alergia a la penicilina',
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01'),
    );

describe('PatientAlertsController — POST /patients/:patientId/alerts', () => {
    let app: INestApplication;

    const mockCreate = { execute: jest.fn() };
    const mockGet = { execute: jest.fn() };
    const mockUpdate = { execute: jest.fn() };
    const mockDelete = { execute: jest.fn() };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PatientAlertsController],
            providers: [
                { provide: GetAlertsUseCase, useValue: mockGet },
                { provide: CreateAlertUseCase, useValue: mockCreate },
                { provide: UpdateAlertUseCase, useValue: mockUpdate },
                { provide: DeleteAlertUseCase, useValue: mockDelete },
            ],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
        );
        await app.init();
    });

    afterAll(() => app.close());
    beforeEach(() => jest.clearAllMocks());

    it('POST 201 — crea alerta correctamente', async () => {
        mockCreate.execute.mockResolvedValue(makeAlert());

        const res = await request(app.getHttpServer())
            .post(`/patients/${PATIENT_ID}/alerts`)
            .send({
                type: AlertType.ALLERGY,
                severity: Severity.HIGH,
                message: 'Alergia a la penicilina',
            });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(ALERT_ID);
        expect(res.body.isActive).toBe(true);
    });

    it('POST 409 — conflicto cuando existe duplicado activo', async () => {
        mockCreate.execute.mockRejectedValue(
            new AlertDuplicateError(PATIENT_ID),
        );

        const res = await request(app.getHttpServer())
            .post(`/patients/${PATIENT_ID}/alerts`)
            .send({
                type: AlertType.ALLERGY,
                severity: Severity.HIGH,
                message: 'Alergia a la penicilina',
            });

        expect(res.status).toBe(409);
    });

    it('POST 400 — body inválido (type incorrecto)', async () => {
        const res = await request(app.getHttpServer())
            .post(`/patients/${PATIENT_ID}/alerts`)
            .send({
                type: 'TIPO_INVALIDO',
                severity: Severity.HIGH,
                message: 'Alergia a la penicilina',
            });

        expect(res.status).toBe(400);
    });

    it('GET 200 — devuelve lista de alertas', async () => {
        mockGet.execute.mockResolvedValue([makeAlert()]);

        const res = await request(app.getHttpServer())
            .get(`/patients/${PATIENT_ID}/alerts`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].severity).toBe(Severity.HIGH);
    });
});