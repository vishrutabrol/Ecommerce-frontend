import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
