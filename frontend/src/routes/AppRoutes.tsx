import { Routes, Route } from 'react-router-dom'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { LandingPage } from '@/features/public/LandingPage'

import ProtectedRoute from './ProtectedRoute'
import { RecruiterDashboard } from '@/features/recruiter/RecruiterDashboard'
import { RecruiterLayout } from '@/layouts/RecruiterLayout'
import { CompanyPage } from '@/features/recruiter/CompanyPage'

const AppRoutes = () => {

    return (
        <Routes>

            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route path='/recruiter'
                element={
                    <ProtectedRoute roles={["recruiter"]}>
                        <RecruiterLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="company" element={<CompanyPage />} />
            </Route>

        </Routes>
    )
}

export default AppRoutes;