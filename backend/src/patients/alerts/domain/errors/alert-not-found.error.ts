export class AlertNotFoundError extends Error {
    constructor(alertId: string) {
        super(`No se encontró la alerta con id ${alertId}`);
        this.name = 'AlertNotFoundError';
    }
}