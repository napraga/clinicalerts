"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertMapper = void 0;
const patient_alert_entity_1 = require("../domain/patient-alert.entity");
class AlertMapper {
    static toDomain(record) {
        return new patient_alert_entity_1.PatientAlert(record.id, record.patientId, record.type, record.severity, record.message, record.isActive, record.createdAt, record.updatedAt);
    }
    static toPrisma(alert) {
        return {
            id: alert.id,
            patientId: alert.patientId,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            isActive: alert.isActive,
        };
    }
}
exports.AlertMapper = AlertMapper;
//# sourceMappingURL=alert.mapper.js.map