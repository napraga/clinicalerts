interface Props {
    children: React.ReactNode;
}

export function AppShell({ children }: Props) {
    return (
        <div className="flex flex-col min-h-dvh bg-slate-50">
            {/* ── Navbar ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 h-[60px] bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-[960px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* Logo / Brand */}
                    <a href="/" className="flex items-center gap-2.5 no-underline">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-[15px] font-semibold text-slate-800 tracking-tight">
                            Clinic<span className="text-blue-600">Say</span>
                        </span>
                    </a>

                    {/* Nav links — hidden on very small screens */}
                    <nav className="hidden sm:flex items-center gap-1">
                        {[
                            { label: 'Pacientes', href: '#', active: true }
                        ].map(({ label, href, active }) => (
                            <a
                                key={label}
                                href={href}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline
                                    ${active
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                    }
                                `}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    {/* User avatar */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                            DM
                        </div>
                        <span className="hidden sm:block text-sm text-slate-600 font-medium">Dr. Muñoz</span>
                    </div>
                </div>
            </header>

            {/* ── Main content ────────────────────────────────────────── */}
            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">ClinicSay © 2025</span>
                    <span className="text-xs text-slate-400">v1.0.0-beta</span>
                </div>
            </footer>
        </div>
    );
}
