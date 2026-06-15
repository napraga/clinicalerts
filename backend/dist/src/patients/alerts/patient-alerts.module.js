"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientAlertsModule = void 0;
const common_1 = require("@nestjs/common");
const patient_alerts_controller_1 = require("./api/patient-alerts.controller");
const get_alerts_use_case_1 = require("./application/use-cases/get-alerts.use-case");
const create_alert_use_case_1 = require("./application/use-cases/create-alert.use-case");
const update_alert_use_case_1 = require("./application/use-cases/update-alert.use-case");
const delete_alert_use_case_1 = require("./application/use-cases/delete-alert.use-case");
const prisma_alert_repository_1 = require("./infrastructure/prisma-alert.repository");
const alert_repository_interface_1 = require("./domain/alert.repository.interface");
let PatientAlertsModule = class PatientAlertsModule {
};
exports.PatientAlertsModule = PatientAlertsModule;
exports.PatientAlertsModule = PatientAlertsModule = __decorate([
    (0, common_1.Module)({
        controllers: [patient_alerts_controller_1.PatientAlertsController],
        providers: [
            get_alerts_use_case_1.GetAlertsUseCase,
            create_alert_use_case_1.CreateAlertUseCase,
            update_alert_use_case_1.UpdateAlertUseCase,
            delete_alert_use_case_1.DeleteAlertUseCase,
            {
                provide: alert_repository_interface_1.ALERT_REPOSITORY,
                useClass: prisma_alert_repository_1.PrismaAlertRepository,
            },
        ],
    })
], PatientAlertsModule);
//# sourceMappingURL=patient-alerts.module.js.map