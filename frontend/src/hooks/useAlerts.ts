import { useState, useEffect, useCallback } from 'react';
import { alertsApi, type AlertResponse, type CreateAlertPayload, type UpdateAlertPayload } from '../api/alerts.api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useAlerts(patientId: string) {
    const [alerts, setAlerts] = useState<AlertResponse[]>([]);
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setStatus('loading');
        setError(null);
        try {
            const data = await alertsApi.getByPatient(patientId);
            setAlerts(data);
            setStatus('success');
        } catch {
            setError('No se pudieron cargar las alertas. Intenta de nuevo.');
            setStatus('error');
        }
    }, [patientId]);

    useEffect(() => { load(); }, [load]);

    const create = async (payload: CreateAlertPayload) => {
        setSaving(true);
        setSaveError(null);
        try {
            const created = await alertsApi.create(patientId, payload);
            setAlerts(prev => [created, ...prev]);
        } catch (e: any) {
            const msg = e?.response?.status === 409
                ? 'Ya existe una alerta activa idéntica para este paciente.'
                : 'No se pudo guardar la alerta. Intenta de nuevo.';
            setSaveError(msg);
            throw e; // para que AlertForm pueda reaccionar
        } finally {
            setSaving(false);
        }
    };

    const update = async (alertId: string, payload: UpdateAlertPayload) => {
        setSaving(true);
        setSaveError(null);
        try {
            const updated = await alertsApi.update(alertId, payload);
            setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
        } catch (e: any) {
            const msg = e?.response?.status === 409
                ? 'Ya existe una alerta activa idéntica para este paciente.'
                : 'No se pudo actualizar la alerta.';
            setSaveError(msg);
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const remove = async (alertId: string) => {
        try {
            await alertsApi.remove(alertId);
            setAlerts(prev => prev.filter(a => a.id !== alertId));
        } catch {
            setSaveError('No se pudo eliminar la alerta.');
        }
    };

    return { alerts, status, error, saving, saveError, load, create, update, remove };
}