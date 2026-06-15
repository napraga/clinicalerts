import type { AlertResponse } from '../../api/alerts.api';

const config: Record<AlertResponse['severity'], { label: string; classes: string }> = {
    high: { label: 'Alta', classes: 'bg-red-100 text-red-800 border border-red-200' },
    medium: { label: 'Media', classes: 'bg-amber-100 text-amber-800 border border-amber-200' },
    low: { label: 'Baja', classes: 'bg-green-100 text-green-700 border border-green-200' },
};

const typeLabel: Record<AlertResponse['type'], string> = {
    ALLERGY: 'Alergia',
    MEDICAL_RISK: 'Riesgo médico',
    SPECIAL_CONDITION: 'Condición especial',
    ADMINISTRATIVE: 'Administrativa',
};

export function SeverityBadge({ severity }: { severity: AlertResponse['severity'] }) {
    const { label, classes } = config[severity];
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes}`}>
            {label}
        </span>
    );
}

export function TypeBadge({ type }: { type: AlertResponse['type'] }) {
    return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {typeLabel[type]}
        </span>
    );
}