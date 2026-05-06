/**
 * Matches 'attendance_status' enum in database
 */
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceModel {
  id: string;
  student_id: string;
  class_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  recorded_by: string | null; // ustaz_id
  created_at: string;
}