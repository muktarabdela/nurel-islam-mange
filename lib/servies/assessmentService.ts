import { supabase } from '@/lib/supabase';
import { AssessmentModel } from '@/models/Assessment';

const TABLE_NAME = 'assessments';

export const assessmentService = {
  async create(payload: Omit<AssessmentModel, 'id' | 'created_at'>): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<AssessmentModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async getByClass(classId: string): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getByUstaz(ustazId: string): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('ustaz_id', ustazId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async update(id: string, updates: Partial<AssessmentModel>): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async togglePublish(id: string): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async unpublish(id: string): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ is_published: false })
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

  async getStudentsByUstaz(ustazId: string): Promise<any[]> {
    // Get all classes this ustaz has assessments for
    const { data: assessmentsData, error: assessmentsError } = await supabase
      .from(TABLE_NAME)
      .select('class_id')
      .eq('ustaz_id', ustazId);

    if (assessmentsError) throw new Error(assessmentsError.message);

    if (!assessmentsData || assessmentsData.length === 0) {
      return [];
    }

    // Get unique class IDs
    const classIds = [...new Set(assessmentsData.map(a => a.class_id).filter(Boolean))];

    if (classIds.length === 0) {
      return [];
    }

    // Get all students in those classes
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .in('class_id', classIds)
      .eq('is_active', true);

    if (error) throw new Error(error.message);
    return data || [];
  }
};
