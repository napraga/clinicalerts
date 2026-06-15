import type { AlertResponse } from '../../api/alerts.api';
import { SeverityBadge, TypeBadge } from './AlertBadge';

interface Props {
    alert: AlertResponse;
    onToggle: (id: string, isActive: boolean) => void;
    onEdit: (alert: AlertResponse) => void;
    onDelete: (id: string) => void;
}

export function AlertCard({ alert, onToggle, onEdit, onDelete }: Props) {
    const isHigh = alert.severity === 'high' && alert.isActive;

    return (
        <div
            className={`
        rounded-xl border p-4 transition-all
        ${isHigh
                    ? 'border-red-200 bg-red-50 shadow-sm shadow-red-100'
                    : alert.isActive
                        ? 'border-slate-200 bg-white shadow-sm'
                        : 'border-slate-100 bg-slate-50 opacity-60'
                }
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={alert.type} />
                    <SeverityBadge severity={alert.severity} />
                    {!alert.isActive && (
                        <span className="text-xs text-slate-400 italic">Inactiva</span>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => onEdit(alert)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Editar alerta"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 113 3L7.5 19.85l-4 1 1-4 12.362-12.363z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => onToggle(alert.id, !alert.isActive)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={alert.isActive ? 'Desactivar' : 'Activar'}
                    >
                        {alert.isActive ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => onDelete(alert.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar alerta"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mensaje */}
            <p className={`mt-2 text-sm leading-relaxed ${alert.isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                {alert.message}
            </p>

            {/* Fecha */}
            <p className="mt-2 text-xs text-slate-400">
                {new Date(alert.createdAt).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric',
                })}
            </p>
        </div>
    );
}