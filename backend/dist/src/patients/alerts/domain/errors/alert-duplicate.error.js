"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertDuplicateError = void 0;
class AlertDuplicateError extends Error {
    constructor(patientId) {
        super(`Ya existe una alerta activa idéntica para el paciente ${patientId}`);
        this.name = 'AlertDuplicateError';
    }
}
exports.AlertDuplicateError = AlertDuplicateError;
//# sourceMappingURL=alert-duplicate.error.js.map