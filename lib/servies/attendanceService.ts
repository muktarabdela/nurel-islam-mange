import { supabase } from '@/lib/supabase';
import { AttendanceModel } from '@/models/Attendance';

const TABLE_NAME = 'attendance';

export const attendanceService = {
  async create(payload: Omit<AttendanceModel, 'id' | 'created_at'>): Promise<AttendanceModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByDate(date: string, classId?: string) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*, student:students(*)')
      .eq('date', date);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  async upsertBulk(records: Omit<AttendanceModel, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(records, { onConflict: 'student_id,date' })
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, student:students(*)');

    if (error) throw new Error(error.message);
    return data || [];
  }
};