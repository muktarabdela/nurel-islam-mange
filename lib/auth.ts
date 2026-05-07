import { Admin } from '@/models/Admin';

export const getAdminFromSession = (): Omit<Admin, 'password'> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const adminData = sessionStorage.getItem('admin');
    if (!adminData) return null;
    
    return JSON.parse(adminData);
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getAdminFromSession() !== null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin');
  }
};
