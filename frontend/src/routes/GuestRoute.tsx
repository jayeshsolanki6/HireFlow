import { Loading } from '@/components/ui/Loading';
import { useAuthStore } from '@/features/auth/authStore';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children } : { children: React.ReactNode }) => {
    const {user, accessToken, isLoading} = useAuthStore();

    if(isLoading){
        return <Loading />;
    }

    if(user && accessToken){
        return <Navigate to={`/${user.role}/dashboard`} replace />
    }

    return children;
}

export default GuestRoute;