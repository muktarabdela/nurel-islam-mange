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
      .select('*, student:students(*)')
      .order('date', { ascending: false }) // FIX 1: Get newest records first
      .limit(1000); 

    if (error) throw new Error(error.message);
    return data || [];
  },
   async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

// Update this function in your attendanceService.ts
async getAllStudentStats() {
  // We fetch a large enough batch to cover recent history for all students
  // Ordering by date DESC is crucial for the "Last 20" logic
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('student_id, status, date')
    .order('date', { ascending: false }); 

  if (error) throw new Error(error.message);

  // We will group records by student ID first
  const studentRecords: Record<string, string[]> = {};
  
  data.forEach(record => {
    const sId = String(record.student_id).trim();
    if (!studentRecords[sId]) {
      studentRecords[sId] = [];
    }
    // Only push if we haven't reached 20 records yet for this student
    if (studentRecords[sId].length < 20) {
      studentRecords[sId].push(record.status);
    }
  });

  // Now calculate stats based on those (up to) 20 records
  const statsMap: Record<string, { present: number, absent: number, late: number, total: number }> = {};
  
  Object.keys(studentRecords).forEach(sId => {
    const statuses = studentRecords[sId];
    statsMap[sId] = {
      total: statuses.length,
      present: statuses.filter(s => s === 'present').length,
      absent: statuses.filter(s => s === 'absent').length,
      late: statuses.filter(s => s === 'late').length,
    };
  });

  return statsMap;
}
};