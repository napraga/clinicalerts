export class AlertDuplicateError extends Error {
    constructor(patientId: string) {
        super(
            `Ya existe una alerta activa idéntica para el paciente ${patientId}`,
        );
        this.name = 'AlertDuplicateError';
    }
}