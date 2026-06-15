import { AppShell } from '../components/layout/AppShell';
import { PatientAlertsPanel } from '../components/alerts/PatientAlertsPanel';

const MOCK_PATIENT = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Carlos Andrés Mejía Rios',
    dob: '1978-04-12',
    idNumber: '71.234.567',
    eps: 'Sura EPS',
    bloodType: 'O+',
};

const CLINICAL_FIELDS = (age: number) => [
    { label: 'EPS',          value: MOCK_PATIENT.eps },
    { label: 'Tipo de sangre', value: MOCK_PATIENT.bloodType },
    { label: 'Edad',         value: `${age} años` },
    { label: 'Documento',    value: `CC ${MOCK_PATIENT.idNumber}` },
];

export function PatientMockPage() {
    const age = new Date().getFullYear() - new Date(MOCK_PATIENT.dob).getFullYear();

    return (
        <AppShell>
            <div className="space-y-5">

                {/* ── Breadcrumb ─────────────────────────────────────── */}
                <nav className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Pacientes</span>
                    <span>/</span>
                    <span className="text-slate-600 font-medium">{MOCK_PATIENT.name}</span>
                </nav>

                {/* ── Patient card ───────────────────────────────────── */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {/* Header with gradient accent */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <div className="p-5 sm:p-6">
                        {/* Identity row */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg sm:text-xl shrink-0 select-none">
                                {MOCK_PATIENT.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                                    {MOCK_PATIENT.name}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Nacido el {new Date(MOCK_PATIENT.dob).toLocaleDateString('es-CO', {
                                        day: '2-digit', month: 'long', year: 'numeric',
                                    })} · {MOCK_PATIENT.bloodType}
                                </p>
                            </div>

                            <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Activo
                            </span>
                        </div>

                        {/* Clinical data grid — 1 col on mobile, 2 on sm+, 4 on lg+ */}
                        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {CLINICAL_FIELDS(age).map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
                                >
                                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">
                                        {label}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Alerts panel ───────────────────────────────────── */}
                <PatientAlertsPanel patientId={MOCK_PATIENT.id} />

            </div>
        </AppShell>
    );
}