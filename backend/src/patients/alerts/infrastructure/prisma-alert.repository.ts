import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAlertRepository } from '../domain/alert.repository.interface';
import { PatientAlert } from '../domain/patient-alert.entity';
import { AlertMapper } from './alert.mapper';

@Injectable()
export class PrismaAlertRepository implements IAlertRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByPatient(patientId: string): Promise<PatientAlert[]> {
        const records = await this.prisma.patientAlert.findMany({
            where: { patientId },
            orderBy: [
                { isActive: 'desc' },   // activas primero
                { createdAt: 'desc' },
            ],
        });

        return records.map(AlertMapper.toDomain);
    }

    async findById(id: string): Promise<PatientAlert | null> {
        const record = await this.prisma.patientAlert.findUnique({
            where: { id },
        });

        return record ? AlertMapper.toDomain(record) : null;
    }

    async findDuplicate(
        patientId: string,
        type: string,
        message: string,
    ): Promise<PatientAlert | null> {
        const record = await this.prisma.patientAlert.findFirst({
            where: {
                patientId,
                type,
                message,
                isActive: true,
            },
        });

        return record ? AlertMapper.toDomain(record) : null;
    }

    async save(alert: PatientAlert): Promise<PatientAlert> {
        const data = AlertMapper.toPrisma(alert);

        const record = await this.prisma.patientAlert.create({ data });

        return AlertMapper.toDomain(record);
    }

    async update(alert: PatientAlert): Promise<PatientAlert> {
        const data = AlertMapper.toPrisma(alert);

        const record = await this.prisma.patientAlert.update({
            where: { id: alert.id },
            data,
        });

        return AlertMapper.toDomain(record);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.patientAlert.delete({ where: { id } });
    }
}