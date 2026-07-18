import { Routes, Route } from 'react-router-dom'

import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'
import { RecruiterLayout } from '@/layouts/RecruiterLayout'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { LandingPage } from '@/features/public/LandingPage'

import { RecruiterDashboard } from '@/features/recruiter/RecruiterDashboard'
import { CompanyPage } from '@/features/recruiter/CompanyPage'
import { JobsPage } from '@/features/recruiter/JobsPage'
import { JobFormPage } from '@/features/recruiter/JobFormPage'
import { JobDetailPage } from '@/features/recruiter/JobDetailPage'

const AppRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<GuestRoute><LandingPage /></GuestRoute>} />
            <Route path='/login' element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path='/register' element={<GuestRoute><RegisterPage /></GuestRoute>} />

            <Route path='/recruiter'
                element={
                    <ProtectedRoute roles={["recruiter"]}>
                        <RecruiterLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="company" element={<CompanyPage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/new" element={<JobFormPage />} />
                <Route path="jobs/:jobId" element={<JobDetailPage />} />
                <Route path="jobs/:jobId/edit" element={<JobFormPage />} />
            </Route>

        </Routes>
    )
}

export default AppRoutes;