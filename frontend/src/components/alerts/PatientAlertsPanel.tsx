import { useState } from 'react';
import type { AlertResponse, CreateAlertPayload, UpdateAlertPayload } from '../../api/alerts.api';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertCard } from './AlertCard';
import { AlertForm } from './AlertForm';

interface Props {
    patientId: string;
}

export function PatientAlertsPanel({ patientId }: Props) {
    const { alerts, status, error, saving, saveError, load, create, update, remove } =
        useAlerts(patientId);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<AlertResponse | null>(null);

    const handleCreate = async (payload: CreateAlertPayload) => {
        await create(payload);
        setShowForm(false);
    };

    const handleUpdate = async (payload: CreateAlertPayload) => {
        if (!editing) return;
        // Strip 'type' — the PATCH endpoint only accepts severity, message, isActive
        const { severity, message } = payload;
        await update(editing.id, { severity, message });
        setEditing(null);
    };

    const handleToggle = (id: string, isActive: boolean) => {
        update(id, { isActive });
    };

    const handleEdit = (alert: AlertResponse) => {
        setEditing(alert);
        setShowForm(false);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
    };

    const activeCount = alerts.filter(a => a.isActive).length;
    const highCount = alerts.filter(a => a.isActive && a.severity === 'high').length;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* Header del panel */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Alertas clínicas</h2>
                        <p className="text-xs text-slate-400">
                            {activeCount === 0
                                ? 'Sin alertas activas'
                                : `${activeCount} activa${activeCount !== 1 ? 's' : ''}${highCount > 0 ? ` · ${highCount} alta${highCount !== 1 ? 's' : ''}` : ''}`
                            }
                        </p>
                    </div>
                </div>

                {!showForm && !editing && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nueva alerta
                    </button>
                )}
            </div>

            {/* Cuerpo */}
            <div className="p-6 space-y-4">

                {/* Formulario de creación */}
                {showForm && (
                    <AlertForm
                        editing={null}
                        saving={saving}
                        saveError={saveError}
                        onSubmit={handleCreate}
                        onCancel={handleCancel}
                    />
                )}

                {/* Formulario de edición */}
                {editing && (
                    <AlertForm
                        editing={editing}
                        saving={saving}
                        saveError={saveError}
                        onSubmit={handleUpdate}
                        onCancel={handleCancel}
                    />
                )}

                {/* Estado: cargando */}
                {status === 'loading' && (
                    <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Cargando alertas…</span>
                    </div>
                )}

                {/* Estado: error de carga */}
                {status === 'error' && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center space-y-2">
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            onClick={load}
                            className="text-xs font-medium text-red-600 underline hover:text-red-800"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Estado: vacío */}
                {status === 'success' && alerts.length === 0 && !showForm && (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-500">Este paciente no tiene alertas registradas.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-xs font-medium text-blue-600 hover:underline"
                        >
                            Agregar la primera alerta
                        </button>
                    </div>
                )}

                {/* Lista de alertas */}
                {status === 'success' && alerts.length > 0 && (
                    <div className="space-y-3">
                        {alerts.map(alert => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onToggle={handleToggle}
                                onEdit={handleEdit}
                                onDelete={remove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}