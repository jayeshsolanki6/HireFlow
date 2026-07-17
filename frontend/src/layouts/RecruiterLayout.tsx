import { Outlet } from 'react-router-dom';

import { RecruiterSidebar } from '@/features/recruiter/RecruiterSidebar';
import { useRecruiterStore } from '@/features/recruiter/recruiterStore';

export const RecruiterLayout = () => {
    const isSidebarCollapsed = useRecruiterStore((state) => state.isSidebarCollapsed);

    return (
        <div className="flex min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)]">
            {/* Sidebar */}
            <RecruiterSidebar />

            {/* Dashboard Main container area */}
            <main className={`flex-grow min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pl-[72px]' : 'pl-[260px]'}`}>
                <div className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};
