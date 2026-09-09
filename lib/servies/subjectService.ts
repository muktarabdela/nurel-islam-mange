import { supabase } from '@/lib/supabase';
import { SubjectModel } from '@/models/subject';

const TABLE_NAME = 'subjects';

export const subjectService = {
  async create(payload: Omit<SubjectModel, 'id' | 'created_at' | 'updated_at'>): Promise<SubjectModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<SubjectModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<SubjectModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async getActive(): Promise<SubjectModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async update(id: string, updates: Partial<SubjectModel>): Promise<SubjectModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async toggleActive(id: string): Promise<SubjectModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deactivate(id: string): Promise<SubjectModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
