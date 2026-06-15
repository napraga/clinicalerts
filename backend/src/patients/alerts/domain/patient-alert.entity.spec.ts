import { PatientAlert } from './patient-alert.entity';
import { AlertType } from './value-objects/alert-type.vo';
import { Severity } from './value-objects/severity.vo';

const makeAlert = (overrides: Partial<{
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
}> = {}) =>
    PatientAlert.create({
        patientId: 'patient-1',
        type: AlertType.ALLERGY,
        severity: Severity.HIGH,
        message: 'Alergia a la penicilina',
        ...overrides,
    });

describe('PatientAlert — entidad de dominio', () => {
    it('crea una alerta activa por defecto', () => {
        const alert = makeAlert();
        expect(alert.isActive).toBe(true);
        expect(alert.id).toBeDefined();
    });

    it('desactiva una alerta', () => {
        const alert = makeAlert();
        alert.deactivate();
        expect(alert.isActive).toBe(false);
    });

    it('reactiva una alerta desactivada', () => {
        const alert = makeAlert();
        alert.deactivate();
        alert.activate();
        expect(alert.isActive).toBe(true);
    });

    it('detecta dos alertas idénticas (mismo paciente, tipo y mensaje)', () => {
        const a = makeAlert();
        const b = makeAlert();
        expect(a.isSameAlertAs(b)).toBe(true);
    });

    it('no considera duplicado si el tipo es distinto', () => {
        const a = makeAlert({ type: AlertType.ALLERGY });
        const b = makeAlert({ type: AlertType.MEDICAL_RISK });
        expect(a.isSameAlertAs(b)).toBe(false);
    });

    it('no considera duplicado si el mensaje es distinto', () => {
        const a = makeAlert({ message: 'Alergia a la penicilina' });
        const b = makeAlert({ message: 'Alergia al ibuprofeno' });
        expect(a.isSameAlertAs(b)).toBe(false);
    });

    it('ignora mayúsculas y espacios al comparar mensajes', () => {
        const a = makeAlert({ message: '  Alergia a la Penicilina  ' });
        const b = makeAlert({ message: 'alergia a la penicilina' });
        expect(a.isSameAlertAs(b)).toBe(true);
    });

    it('identifica correctamente severidad alta', () => {
        const alert = makeAlert({ severity: Severity.HIGH });
        expect(alert.isHighSeverity()).toBe(true);
    });
});