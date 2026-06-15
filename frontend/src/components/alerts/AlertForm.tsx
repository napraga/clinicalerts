import { useState, useEffect } from 'react';
import type { AlertResponse, CreateAlertPayload } from '../../api/alerts.api';

interface Props {
    editing?: AlertResponse | null;
    saving: boolean;
    saveError: string | null;
    onSubmit: (payload: CreateAlertPayload) => Promise<void>;
    onCancel: () => void;
}

const TYPES: { value: AlertResponse['type']; label: string }[] = [
    { value: 'ALLERGY', label: 'Alergia' },
    { value: 'MEDICAL_RISK', label: 'Riesgo médico' },
    { value: 'SPECIAL_CONDITION', label: 'Condición especial' },
    { value: 'ADMINISTRATIVE', label: 'Administrativa' },
];

const SEVERITIES: { value: AlertResponse['severity']; label: string }[] = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
];

export function AlertForm({ editing, saving, saveError, onSubmit, onCancel }: Props) {
    const [type, setType] = useState<AlertResponse['type']>('ALLERGY');
    const [severity, setSeverity] = useState<AlertResponse['severity']>('low');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ message?: string }>({});

    useEffect(() => {
        if (editing) {
            setType(editing.type);
            setSeverity(editing.severity);
            setMessage(editing.message);
        } else {
            setType('ALLERGY');
            setSeverity('low');
            setMessage('');
        }
        setErrors({});
    }, [editing]);

    const validate = () => {
        const e: { message?: string } = {};
        if (message.trim().length < 3) e.message = 'El mensaje debe tener al menos 3 caracteres.';
        if (message.trim().length > 500) e.message = 'El mensaje no puede superar los 500 caracteres.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await onSubmit({ type, severity, message: message.trim() });
            setMessage('');
            setType('ALLERGY');
            setSeverity('low');
        } catch {
            // saveError lo maneja el hook — no hace falta nada acá
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">
                {editing ? 'Editar alerta' : 'Nueva alerta'}
            </h3>

            {/* Tipo */}
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
                <select
                    value={type}
                    onChange={e => setType(e.target.value as AlertResponse['type'])}
                    disabled={!!editing} // el tipo no cambia al editar
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* Severidad */}
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Severidad</label>
                <div className="flex gap-2">
                    {SEVERITIES.map(s => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setSeverity(s.value)}
                            className={`
                flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${severity === s.value
                                    ? s.value === 'high' ? 'bg-red-100 border-red-300 text-red-800'
                                        : s.value === 'medium' ? 'bg-amber-100 border-amber-300 text-amber-800'
                                            : 'bg-green-100 border-green-300 text-green-700'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }
              `}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mensaje */}
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mensaje</label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Describe la alerta con detalle clínico relevante..."
                    className={`
            w-full rounded-lg border px-3 py-2 text-sm text-slate-700 resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}
          `}
                />
                {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
            </div>

            {/* Error de servidor */}
            {saveError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                    {saveError}
                </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear alerta'}
                </button>
                <button
                    onClick={onCancel}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}