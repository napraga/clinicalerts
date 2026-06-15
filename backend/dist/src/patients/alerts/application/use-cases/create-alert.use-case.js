"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlertUseCase = void 0;
const common_1 = require("@nestjs/common");
const alertRepositoryInterface = __importStar(require("../../domain/alert.repository.interface"));
const patient_alert_entity_1 = require("../../domain/patient-alert.entity");
const alert_duplicate_error_1 = require("../../domain/errors/alert-duplicate.error");
let CreateAlertUseCase = class CreateAlertUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(command) {
        const duplicate = await this.repo.findDuplicate(command.patientId, command.type, command.message);
        if (duplicate) {
            throw new alert_duplicate_error_1.AlertDuplicateError(command.patientId);
        }
        const alert = patient_alert_entity_1.PatientAlert.create({
            patientId: command.patientId,
            type: command.type,
            severity: command.severity,
            message: command.message,
        });
        return this.repo.save(alert);
    }
};
exports.CreateAlertUseCase = CreateAlertUseCase;
exports.CreateAlertUseCase = CreateAlertUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(alertRepositoryInterface.ALERT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateAlertUseCase);
//# sourceMappingURL=create-alert.use-case.js.map