import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LogOut, Menu, PanelLeftClose, LayoutDashboard, FileText, Bookmark, UserSquare2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { useCandidateStore } from './candidateStore';
import { useAuthStore } from '../auth/authStore';



const links = [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: <LayoutDashboard size={15} /> },
    { label: 'Browse Jobs', path: '/candidate/jobs', icon: <BriefcaseBusiness size={15} /> },
    { label: 'Applied Jobs', path: '/candidate/applications', icon: <FileText size={15} /> },
    { label: 'Saved Jobs', path: '/candidate/saved', icon: <Bookmark size={15} /> },
    { label: 'Profile', path: '/candidate/profile', icon: <UserSquare2 size={15} /> }
];

export const CandidateSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isSidebarCollapsed = useCandidateStore((state) => state.isSidebarCollapsed);
    const setIsSidebarCollapsed = useCandidateStore((state) => state.setIsSidebarCollapsed);

    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    if (!user || user.role !== 'candidate') return null;

    return (
        <aside className={`group shrink-0 border-r border-[var(--color-hairline)] bg-[var(--color-surface-1)] flex flex-col justify-between select-none fixed top-0 bottom-0 left-0 z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[72px]' : 'max-md:w-[72px] w-[260px]'}`}>
            <div className="flex flex-col">
                {/* Header: Logo and Toggle */}
                <div className={`flex items-center h-16 ${isSidebarCollapsed ? 'justify-center' : 'px-5 justify-between'} transition-all duration-300`}>
                    {/* Logo */}
                    <div
                        className={`flex items-center gap-2.5 font-semibold text-[17px] tracking-tight cursor-pointer overflow-hidden ${isSidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100 max-md:hidden'}`}
                        onClick={() => navigate('/')}
                        style={{ transition: 'width 0.2s, opacity 0.2s' }}
                    >
                        <Logo size="sm" />
                    </div>

                    {/* Toggle Button inside Header */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="text-[var(--color-ink-subtle)] hover:text-black flex items-center justify-center h-8 w-8 rounded-md hover:bg-[var(--color-surface-2)] transition-colors shrink-0 max-md:hidden"
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
                                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3 max-md:justify-center max-md:px-0'} py-2 rounded-md text-[13px] font-medium transition-all group/link ${isActive
                                        ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)] font-semibold shadow-sm border border-[var(--color-hairline)]'
                                        : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] border border-transparent'
                                    }`}
                            >
                                <span className={`shrink-0 transition-colors ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)] group-hover/link:text-[var(--color-ink)]'}`}>
                                    {link.icon}
                                </span>
                                {!isSidebarCollapsed && (
                                    <span className="whitespace-nowrap max-md:hidden">{link.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User footer */}
            <div className={`mt-auto mb-4 mx-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-2)]/50 flex items-center ${isSidebarCollapsed ? 'p-2 justify-center' : 'p-3 justify-between max-md:p-2 max-md:justify-center'} transition-all duration-300`}>
                {!isSidebarCollapsed && (
                    <div className="flex flex-col min-w-0 pl-1 max-md:hidden">
                        <span className="text-[13px] font-semibold text-[var(--color-ink)] truncate leading-none">{user.name}</span>
                        <span className="text-[10px] mt-1 font-mono text-[var(--color-ink-subtle)] uppercase tracking-wider">{user.role}</span>
                    </div>
                )}
                <button
                    onClick={() => {
                        logout();
                    }}
                    className={`text-[var(--color-ink-subtle)] hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 shrink-0 transition-colors ${isSidebarCollapsed ? 'w-full flex justify-center' : 'max-md:w-full max-md:flex max-md:justify-center'}`}
                    title="Logout session"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    )
}
