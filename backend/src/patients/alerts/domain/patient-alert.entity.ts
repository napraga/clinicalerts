import { randomUUID } from 'crypto';
import { AlertType } from './value-objects/alert-type.vo';
import { Severity } from './value-objects/severity.vo';

export interface CreateAlertProps {
    patientId: string;
    type: AlertType;
    severity: Severity;
    message: string;
}

export class PatientAlert {
    constructor(
        public readonly id: string,
        public readonly patientId: string,
        public readonly type: AlertType,
        public readonly severity: Severity,
        public readonly message: string,
        public isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    // ─── Factory ──────────────────────────────────────────────────────────────

    static create(props: CreateAlertProps): PatientAlert {
        const now = new Date();

        return new PatientAlert(
            randomUUID(),
            props.patientId,
            props.type,
            props.severity,
            props.message,
            true, // toda alerta nace activa
            now,
            now,
        );
    }

    // ─── Comportamientos de dominio ───────────────────────────────────────────

    activate(): void {
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
    }

    toggle(): void {
        this.isActive = !this.isActive;
    }

    /**
     * Regla de negocio central.
     * Dos alertas son idénticas si comparten patientId, type y message
     * (sin importar severidad ni estado).
     */
    isSameAlertAs(other: PatientAlert): boolean {
        return (
            this.patientId === other.patientId &&
            this.type === other.type &&
            this.message.trim().toLowerCase() === other.message.trim().toLowerCase()
        );
    }

    isHighSeverity(): boolean {
        return this.severity === Severity.HIGH;
    }
}