import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/features/auth/authStore';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles: ('candidate' | 'recruiter')[];
}

const ProtectedRoute = ({ children, roles } : ProtectedRouteProps) => {
    const {user, accessToken, isLoading} = useAuthStore();

    if(isLoading){
        return (
            <Loading />
        )
    }

    if(!user || !accessToken){
        return <Navigate to="/login" replace/>
    }

    if(!roles.includes(user.role)){
        return <Navigate to="/" replace/>
    }

    return children;
}

export default ProtectedRoute