import { supabase } from '@/lib/supabase';
import { Admin, AdminLoginRequest, AdminLoginResponse } from '@/models/Admin';

const TABLE_NAME = 'admins';

export const adminService = {
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      // Query admin by phone number
      const { data: admin, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('phone_number', credentials.phone_number)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            admin: null as any,
            success: false,
            message: 'Invalid phone number or password'
          };
        }
        throw new Error(error.message);
      }

      // Compare password directly (no hashing as requested)
      if (admin.password !== credentials.password) {
        return {
          admin: null as any,
          success: false,
          message: 'Invalid phone number or password'
        };
      }

      // Update last login
      await supabase
        .from(TABLE_NAME)
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      // Remove password from response
      const { password, ...adminWithoutPassword } = admin;

      return {
        admin: adminWithoutPassword,
        success: true,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        admin: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },

  async getById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: Partial<Admin>): Promise<Admin> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async create(payload: Omit<Admin, 'id' | 'created_at'>): Promise<Admin> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
