import { AttendanceStatus } from './Attendance';

export interface UstazAttendanceModel {
  id: string;
  ustaz_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}