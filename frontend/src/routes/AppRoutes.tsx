import { Routes, Route } from 'react-router-dom'

import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { LandingPage } from '@/features/public/LandingPage'

import { RecruiterLayout } from '@/layouts/RecruiterLayout'
import { RecruiterDashboard } from '@/features/recruiter/RecruiterDashboard'
import { CompanyPage } from '@/features/recruiter/CompanyPage'
import { JobsPage } from '@/features/recruiter/JobsPage'
import { JobFormPage } from '@/features/recruiter/JobFormPage'
import { RecruiterJobDetailPage } from '@/features/recruiter/RecruiterJobDetailPage'
import { JobApplicantsPage } from '@/features/recruiter/JobApplicationsPage'
import { CandidateProfilePage } from '@/features/recruiter/CandidateProfilePage'

import { CandidateLayout } from '@/layouts/CandidateLayout'
import { CandidateDashboard } from '@/features/candidate/CandidateDashboard'
import { ProfilePage } from '@/features/candidate/ProfilePage'
import { BrowseJobsPage } from '@/features/candidate/BrowseJobsPage'
import { CandidateJobDetailPage} from '@/features/candidate/CandidateJobDetailPage'
import { MyApplicationsPage } from '@/features/candidate/MyApplicationPage'
import { SavedJobsPage } from '@/features/candidate/SavedJobsPage'

const AppRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<GuestRoute><LandingPage /></GuestRoute>} />
            <Route path='/login' element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path='/register' element={<GuestRoute><RegisterPage /></GuestRoute>} />
            

            <Route path='/candidate'
                element={
                    <ProtectedRoute roles={["candidate"]}>
                        <CandidateLayout />
                    </ProtectedRoute>
                }
            >
                <Route path='dashboard' element={<CandidateDashboard />} />
                <Route path='profile' element={<ProfilePage />} />
                <Route path='jobs' element={<BrowseJobsPage />} />
                <Route path='jobs/:jobId' element={<CandidateJobDetailPage />} />
                <Route path='applications' element={<MyApplicationsPage />} />
                <Route path='saved' element={<SavedJobsPage />} />
            </Route>


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
                <Route path="jobs/:jobId" element={<RecruiterJobDetailPage />} />
                <Route path="jobs/:jobId/edit" element={<JobFormPage />} />
                <Route path="jobs/:jobId/applicants" element={<JobApplicantsPage />} />
                <Route path="applicants/:applicationId" element={<CandidateProfilePage/>} />
            </Route>

            
        </Routes>
    )
}

export default AppRoutes;