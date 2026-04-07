import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, accessToken, setUser, setTokens, logout: storeLogout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const tokens = await authService.login(email, password);
    setTokens(tokens.access_token, tokens.refresh_token);
    const me = await authService.getMe();
    setUser(me);
    return me;
  };

  const logout = async () => {
    await authService.logout();
    storeLogout();
    navigate('/login');
  };

  return {
    user,
    accessToken,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
  };
}
