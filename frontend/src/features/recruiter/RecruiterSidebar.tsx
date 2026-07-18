import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, Menu, PanelLeftClose, LayoutDashboard, Building2, FileText } from 'lucide-react';
import { useAuthStore } from '../auth/authStore';
import { useRecruiterStore } from './recruiterStore';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const links = [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: <LayoutDashboard size={15} /> },
    { label: 'My Job Postings', path: '/recruiter/jobs', icon: <FileText size={15} /> },
    { label: 'Post a Job', path: '/recruiter/jobs/new', icon: <PlusIcon /> },
    { label: 'Company Profile', path: '/recruiter/company', icon: <Building2 size={15} /> }
];

export const RecruiterSidebar = () => {
    const isSidebarCollapsed = useRecruiterStore((state) => state.isSidebarCollapsed);
    const setIsSidebarCollapsed = useRecruiterStore((state) => state.setIsSidebarCollapsed);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const location = useLocation();
    const navigate = useNavigate();

    if (!user || user.role !== 'recruiter') return null;

    return (
        <aside className={`group shrink-0 border-r border-[var(--color-hairline)] bg-[var(--color-surface-1)] flex flex-col justify-between select-none fixed top-0 bottom-0 left-0 z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
            <div className="flex flex-col">
                {/* Header: Logo and Toggle */}
                <div className={`flex items-center h-16 ${isSidebarCollapsed ? 'justify-center' : 'px-5 justify-between'} transition-all duration-300`}>
                    {/* Logo */}
                    <div
                        className={`flex items-center gap-2.5 font-semibold text-[17px] tracking-tight cursor-pointer overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'}`}
                        onClick={() => navigate('/')}
                        style={{ transition: 'width 0.2s, opacity 0.2s' }}
                    >
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-black flex items-center justify-center text-white">
                            <Briefcase size={16} strokeWidth={2.5} />
                        </div>
                        <span className="whitespace-nowrap">HireFlow</span>
                    </div>

                    {/* Toggle Button inside Header */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="text-[var(--color-ink-subtle)] hover:text-black flex items-center justify-center h-8 w-8 rounded-md hover:bg-[var(--color-surface-2)] transition-colors shrink-0"
                        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isSidebarCollapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 px-3 mt-4">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                title={isSidebarCollapsed ? link.label : undefined}
                                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2 rounded-md text-[13px] font-medium transition-all group/link ${isActive
                                    ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)] font-semibold shadow-sm border border-[var(--color-hairline)]'
                                    : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border border-transparent'
                                    }`}
                            >
                                <span className={`shrink-0 transition-colors ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)] group-hover/link:text-[var(--color-ink)]'}`}>
                                    {link.icon}
                                </span>
                                {!isSidebarCollapsed && (
                                    <span className="whitespace-nowrap">{link.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User footer */}
            <div className={`mt-auto mb-4 mx-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-2)]/50 flex items-center ${isSidebarCollapsed ? 'p-2 justify-center' : 'p-3 justify-between'} transition-all duration-300`}>
                {!isSidebarCollapsed && (
                    <div className="flex flex-col min-w-0 pl-1">
                        <span className="text-[13px] font-semibold text-[var(--color-ink)] truncate leading-none">{user.name}</span>
                        <span className="text-[10px] mt-1 font-mono text-[var(--color-ink-subtle)] uppercase tracking-wider">{user.role}</span>
                    </div>
                )}
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className={`text-[var(--color-ink-subtle)] hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 shrink-0 transition-colors ${isSidebarCollapsed ? 'w-full flex justify-center' : ''}`}
                    title="Logout session"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    )
}
