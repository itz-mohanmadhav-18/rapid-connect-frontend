import { UserRole } from '@/contexts/UserContext';
import apiConfig, { handleApiResponse, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api-config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${apiConfig.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleApiResponse(response);
  
  // Save the token
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  const response = await fetch(`${apiConfig.API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await handleApiResponse(response);
  
  // Save the token
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

export const logout = (): void => {
  removeAuthToken();
};

export const getCurrentUser = async (): Promise<any> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${apiConfig.API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return handleApiResponse(response);
};

export default {
  login,
  signup,
  logout,
  getCurrentUser,
};