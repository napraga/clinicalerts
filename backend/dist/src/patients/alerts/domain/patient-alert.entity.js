"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAlert = void 0;
const crypto_1 = require("crypto");
const severity_vo_1 = require("./value-objects/severity.vo");
class PatientAlert {
    id;
    patientId;
    type;
    severity;
    message;
    isActive;
    createdAt;
    updatedAt;
    constructor(id, patientId, type, severity, message, isActive, createdAt, updatedAt) {
        this.id = id;
        this.patientId = patientId;
        this.type = type;
        this.severity = severity;
        this.message = message;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new PatientAlert((0, crypto_1.randomUUID)(), props.patientId, props.type, props.severity, props.message, true, now, now);
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
    toggle() {
        this.isActive = !this.isActive;
    }
    isSameAlertAs(other) {
        return (this.patientId === other.patientId &&
            this.type === other.type &&
            this.message.trim().toLowerCase() === other.message.trim().toLowerCase());
    }
    isHighSeverity() {
        return this.severity === severity_vo_1.Severity.HIGH;
    }
}
exports.PatientAlert = PatientAlert;
//# sourceMappingURL=patient-alert.entity.js.map