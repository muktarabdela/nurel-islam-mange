import { Admin } from '@/models/Admin';

export const getAdminFromSession = (): Omit<Admin, 'password'> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get from cookie first
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(cookie => cookie.trim().startsWith('admin='));
    
    if (adminCookie) {
      const adminData = adminCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(adminData));
    }
    
    return null;
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
    // Clear the admin cookie
    document.cookie = 'admin=; path=/; max-age=0; SameSite=Strict';
  }
};
