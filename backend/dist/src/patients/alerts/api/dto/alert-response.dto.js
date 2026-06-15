"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertResponseDto = void 0;
class AlertResponseDto {
    id;
    patientId;
    type;
    severity;
    message;
    isActive;
    createdAt;
    updatedAt;
    static fromDomain(alert) {
        const dto = new AlertResponseDto();
        dto.id = alert.id;
        dto.patientId = alert.patientId;
        dto.type = alert.type;
        dto.severity = alert.severity;
        dto.message = alert.message;
        dto.isActive = alert.isActive;
        dto.createdAt = alert.createdAt.toISOString();
        dto.updatedAt = alert.updatedAt.toISOString();
        return dto;
    }
}
exports.AlertResponseDto = AlertResponseDto;
//# sourceMappingURL=alert-response.dto.js.map