"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAlertsController = void 0;
const common_1 = require("@nestjs/common");
const get_alerts_use_case_1 = require("../application/use-cases/get-alerts.use-case");
const create_alert_use_case_1 = require("../application/use-cases/create-alert.use-case");
const update_alert_use_case_1 = require("../application/use-cases/update-alert.use-case");
const delete_alert_use_case_1 = require("../application/use-cases/delete-alert.use-case");
const create_alert_dto_1 = require("./dto/create-alert.dto");
const update_alert_dto_1 = require("./dto/update-alert.dto");
const alert_response_dto_1 = require("./dto/alert-response.dto");
const alert_duplicate_error_1 = require("../domain/errors/alert-duplicate.error");
const alert_not_found_error_1 = require("../domain/errors/alert-not-found.error");
let PatientAlertsController = class PatientAlertsController {
    getAlerts;
    createAlert;
    updateAlert;
    deleteAlert;
    constructor(getAlerts, createAlert, updateAlert, deleteAlert) {
        this.getAlerts = getAlerts;
        this.createAlert = createAlert;
        this.updateAlert = updateAlert;
        this.deleteAlert = deleteAlert;
    }
    async findAll(patientId) {
        const alerts = await this.getAlerts.execute(patientId);
        return alerts.map(alert_response_dto_1.AlertResponseDto.fromDomain);
    }
    async create(patientId, dto) {
        try {
            const alert = await this.createAlert.execute({ patientId, ...dto });
            return alert_response_dto_1.AlertResponseDto.fromDomain(alert);
        }
        catch (e) {
            if (e instanceof alert_duplicate_error_1.AlertDuplicateError) {
                throw new common_1.ConflictException(e.message);
            }
            throw e;
        }
    }
    async update(alertId, dto) {
        try {
            const alert = await this.updateAlert.execute({ alertId, ...dto });
            return alert_response_dto_1.AlertResponseDto.fromDomain(alert);
        }
        catch (e) {
            if (e instanceof alert_not_found_error_1.AlertNotFoundError) {
                throw new common_1.NotFoundException(e.message);
            }
            if (e instanceof alert_duplicate_error_1.AlertDuplicateError) {
                throw new common_1.ConflictException(e.message);
            }
            throw e;
        }
    }
    async remove(alertId) {
        try {
            await this.deleteAlert.execute(alertId);
        }
        catch (e) {
            if (e instanceof alert_not_found_error_1.AlertNotFoundError) {
                throw new common_1.NotFoundException(e.message);
            }
            throw e;
        }
    }
};
exports.PatientAlertsController = PatientAlertsController;
__decorate([
    (0, common_1.Get)('patients/:patientId/alerts'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientAlertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('patients/:patientId/alerts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_alert_dto_1.CreateAlertDto]),
    __metadata("design:returntype", Promise)
], PatientAlertsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('patient-alerts/:alertId'),
    __param(0, (0, common_1.Param)('alertId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_alert_dto_1.UpdateAlertDto]),
    __metadata("design:returntype", Promise)
], PatientAlertsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('patient-alerts/:alertId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('alertId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientAlertsController.prototype, "remove", null);
exports.PatientAlertsController = PatientAlertsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [get_alerts_use_case_1.GetAlertsUseCase,
        create_alert_use_case_1.CreateAlertUseCase,
        update_alert_use_case_1.UpdateAlertUseCase,
        delete_alert_use_case_1.DeleteAlertUseCase])
], PatientAlertsController);
//# sourceMappingURL=patient-alerts.controller.js.map