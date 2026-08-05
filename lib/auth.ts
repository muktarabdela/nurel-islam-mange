import { Admin } from '@/models/Admin';
import { UstazModel } from '@/models/Ustaz';

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

export const getUstazFromSession = (): UstazModel | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get from cookie first
    const cookies = document.cookie.split(';');
    const ustazCookie = cookies.find(cookie => cookie.trim().startsWith('ustaz='));
    
    if (ustazCookie) {
      const ustazData = ustazCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(ustazData));
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing ustaz data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getAdminFromSession() !== null || getUstazFromSession() !== null;
};

export const isAdmin = (): boolean => {
  return getAdminFromSession() !== null;
};

export const isUstaz = (): boolean => {
  return getUstazFromSession() !== null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    // Clear the admin cookie
    document.cookie = 'admin=; path=/; max-age=0; SameSite=Strict';
  }
};
