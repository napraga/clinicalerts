import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PatientAlertsPanel } from './PatientAlertsPanel';
import * as alertsApi from '../../api/alerts.api';
import type { AlertResponse } from '../../api/alerts.api';

// ─── Mock del módulo API ───────────────────────────────────────────────────

vi.mock('../../api/alerts.api', () => ({
    alertsApi: {
        getByPatient: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    },
}));

const PATIENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const makeAlert = (overrides: Partial<AlertResponse> = {}): AlertResponse => ({
    id: 'alert-001',
    patientId: PATIENT_ID,
    type: 'ALLERGY',
    severity: 'high',
    message: 'Alergia a la penicilina',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

const mockApi = alertsApi.alertsApi as {
    getByPatient: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
};

// ─── Tests ────────────────────────────────────────────────────────────────

describe('PatientAlertsPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('muestra el estado de carga mientras espera la API', () => {
        mockApi.getByPatient.mockReturnValue(new Promise(() => { })); // nunca resuelve

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        expect(screen.getByText(/cargando alertas/i)).toBeInTheDocument();
    });

    it('muestra el estado vacío cuando no hay alertas', async () => {
        mockApi.getByPatient.mockResolvedValue([]);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() =>
            expect(screen.getByText(/no tiene alertas registradas/i)).toBeInTheDocument(),
        );
    });

    it('muestra el estado de error si la API falla', async () => {
        mockApi.getByPatient.mockRejectedValue(new Error('network error'));

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() =>
            expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument(),
        );
        expect(screen.getByText(/reintentar/i)).toBeInTheDocument();
    });

    it('renderiza alertas activas y muestra el conteo correcto', async () => {
        mockApi.getByPatient.mockResolvedValue([
            makeAlert({ id: '1', isActive: true }),
            makeAlert({ id: '2', isActive: true, severity: 'low', message: 'Riesgo de caída' }),
            makeAlert({ id: '3', isActive: false, message: 'Alerta antigua' }),
        ]);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() =>
            expect(screen.getByText('Alergia a la penicilina')).toBeInTheDocument(),
        );

        expect(screen.getByText('Riesgo de caída')).toBeInTheDocument();
        expect(screen.getByText('Alerta antigua')).toBeInTheDocument();
        // Contador: 2 activas, 1 alta
        expect(screen.getByText(/2 activas/i)).toBeInTheDocument();
        expect(screen.getByText(/1 alta/i)).toBeInTheDocument();
    });

    it('abre el formulario al hacer clic en "Nueva alerta"', async () => {
        mockApi.getByPatient.mockResolvedValue([]);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() => screen.getByText(/nueva alerta/i));
        await userEvent.click(screen.getByText(/nueva alerta/i));

        expect(screen.getByPlaceholderText(/describe la alerta/i)).toBeInTheDocument();
    });

    it('crea una alerta y la agrega a la lista', async () => {
        const newAlert = makeAlert({ id: 'new-1', message: 'Requiere silla de ruedas' });
        mockApi.getByPatient.mockResolvedValue([]);
        mockApi.create.mockResolvedValue(newAlert);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() => screen.getByText(/nueva alerta/i));
        await userEvent.click(screen.getByText(/nueva alerta/i));

        await userEvent.type(
            screen.getByPlaceholderText(/describe la alerta/i),
            'Requiere silla de ruedas',
        );
        await userEvent.click(screen.getByText(/crear alerta/i));

        await waitFor(() =>
            expect(screen.getByText('Requiere silla de ruedas')).toBeInTheDocument(),
        );
        expect(mockApi.create).toHaveBeenCalledWith(PATIENT_ID, expect.objectContaining({
            message: 'Requiere silla de ruedas',
        }));
    });

    it('muestra error 409 cuando el backend rechaza un duplicado', async () => {
        mockApi.getByPatient.mockResolvedValue([makeAlert()]);
        mockApi.create.mockRejectedValue({ response: { status: 409 } });

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() => screen.getByText(/nueva alerta/i));
        await userEvent.click(screen.getByText(/nueva alerta/i));

        await userEvent.type(
            screen.getByPlaceholderText(/describe la alerta/i),
            'Alergia a la penicilina',
        );
        await userEvent.click(screen.getByText(/crear alerta/i));

        await waitFor(() =>
            expect(screen.getByText(/ya existe una alerta activa idéntica/i)).toBeInTheDocument(),
        );
    });

    it('valida el formulario sin llamar a la API si el mensaje es muy corto', async () => {
        mockApi.getByPatient.mockResolvedValue([]);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() => screen.getByText(/nueva alerta/i));
        await userEvent.click(screen.getByText(/nueva alerta/i));

        await userEvent.type(screen.getByPlaceholderText(/describe la alerta/i), 'ab');
        await userEvent.click(screen.getByText(/crear alerta/i));

        expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
        expect(mockApi.create).not.toHaveBeenCalled();
    });

    it('cancela el formulario y lo oculta', async () => {
        mockApi.getByPatient.mockResolvedValue([]);

        render(<PatientAlertsPanel patientId={PATIENT_ID} />);

        await waitFor(() => screen.getByText(/nueva alerta/i));
        await userEvent.click(screen.getByText(/nueva alerta/i));

        expect(screen.getByPlaceholderText(/describe la alerta/i)).toBeInTheDocument();

        await userEvent.click(screen.getByText(/cancelar/i));

        expect(screen.queryByPlaceholderText(/describe la alerta/i)).not.toBeInTheDocument();
    });
});