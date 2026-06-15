import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

export interface AlertResponse {
    id: string;
    patientId: string;
    type: 'ALLERGY' | 'MEDICAL_RISK' | 'SPECIAL_CONDITION' | 'ADMINISTRATIVE';
    severity: 'low' | 'medium' | 'high';
    message: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAlertPayload {
    type: AlertResponse['type'];
    severity: AlertResponse['severity'];
    message: string;
}

export interface UpdateAlertPayload {
    severity?: AlertResponse['severity'];
    message?: string;
    isActive?: boolean;
}

export const alertsApi = {
    getByPatient: (patientId: string) =>
        http.get<AlertResponse[]>(`/patients/${patientId}/alerts`).then(r => r.data),

    create: (patientId: string, payload: CreateAlertPayload) =>
        http.post<AlertResponse>(`/patients/${patientId}/alerts`, payload).then(r => r.data),

    update: (alertId: string, payload: UpdateAlertPayload) =>
        http.patch<AlertResponse>(`/patient-alerts/${alertId}`, payload).then(r => r.data),

    remove: (alertId: string) =>
        http.delete(`/patient-alerts/${alertId}`),
};