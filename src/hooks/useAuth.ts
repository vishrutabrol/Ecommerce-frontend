import { useUserStore } from '../store/userStore';

export const useAuth = () => {
  const { fullName, email, token, isLoggedIn, login, logout } = useUserStore();
  return { fullName, email, token, isLoggedIn, login, logout };
};
