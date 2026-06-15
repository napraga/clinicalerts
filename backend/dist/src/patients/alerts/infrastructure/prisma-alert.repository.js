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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAlertRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const alert_mapper_1 = require("./alert.mapper");
let PrismaAlertRepository = class PrismaAlertRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPatient(patientId) {
        const records = await this.prisma.patientAlert.findMany({
            where: { patientId },
            orderBy: [
                { isActive: 'desc' },
                { createdAt: 'desc' },
            ],
        });
        return records.map(alert_mapper_1.AlertMapper.toDomain);
    }
    async findById(id) {
        const record = await this.prisma.patientAlert.findUnique({
            where: { id },
        });
        return record ? alert_mapper_1.AlertMapper.toDomain(record) : null;
    }
    async findDuplicate(patientId, type, message) {
        const record = await this.prisma.patientAlert.findFirst({
            where: {
                patientId,
                type,
                message,
                isActive: true,
            },
        });
        return record ? alert_mapper_1.AlertMapper.toDomain(record) : null;
    }
    async save(alert) {
        const data = alert_mapper_1.AlertMapper.toPrisma(alert);
        const record = await this.prisma.patientAlert.create({ data });
        return alert_mapper_1.AlertMapper.toDomain(record);
    }
    async update(alert) {
        const data = alert_mapper_1.AlertMapper.toPrisma(alert);
        const record = await this.prisma.patientAlert.update({
            where: { id: alert.id },
            data,
        });
        return alert_mapper_1.AlertMapper.toDomain(record);
    }
    async delete(id) {
        await this.prisma.patientAlert.delete({ where: { id } });
    }
};
exports.PrismaAlertRepository = PrismaAlertRepository;
exports.PrismaAlertRepository = PrismaAlertRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAlertRepository);
//# sourceMappingURL=prisma-alert.repository.js.map