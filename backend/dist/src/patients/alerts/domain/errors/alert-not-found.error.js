"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertNotFoundError = void 0;
class AlertNotFoundError extends Error {
    constructor(alertId) {
        super(`No se encontró la alerta con id ${alertId}`);
        this.name = 'AlertNotFoundError';
    }
}
exports.AlertNotFoundError = AlertNotFoundError;
//# sourceMappingURL=alert-not-found.error.js.map