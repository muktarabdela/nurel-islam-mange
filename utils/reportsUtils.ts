import { 
  getCurrentEthiopianDate, 
  formatEthiopianDate, 
  ethiopianToGregorian, 
  gregorianToEthiopian,
  EthiopianDateComponents 
} from "@/lib/utils/ethiopian-date";
import { DateFilter } from "@/hooks/useAttendanceFilter";

export interface AttendanceRecord {
  date: string;
  ethiopian_date?: string;
  status: string;
  class_id?: string;
}

export interface AttendanceMetrics {
  avgAttendanceRate: number;
  absentCount: number;
}

export interface ChartDataPoint {
  name: string;
  present: number;
  absent: number;
  ethiopianDate?: string;
}

export interface ClassTableData {
  id: string;
  name: string;
  ustaz: string;
  studentsCount: number;
  totalPresent: number;
  totalAbsent: number;
}

export function calculateAttendanceMetrics(attendance: AttendanceRecord[]): AttendanceMetrics {
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === "present").length;
  const absentCount = attendance.filter(a => a.status === "absent").length;
  
  const avgAttendanceRate = totalRecords > 0 
    ? Math.round((presentCount / totalRecords) * 100) 
    : 0;

  return { avgAttendanceRate, absentCount };
}

export function generateChartData(
  attendance: AttendanceRecord[], 
  dateFilter: DateFilter,
  dateRange?: { from?: string; to?: string }
): ChartDataPoint[] {
  if (dateFilter === "week") {
    const ethiopianDays = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
    
    // Calculate start of the current week (Monday)
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const diffToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diffToMonday);
    
    // Generate 7 days strictly starting from Monday
    return Array.from({ length: 7 }).map((_, i) => {
      const gregorianDate = new Date(startOfWeek);
      gregorianDate.setDate(startOfWeek.getDate() + i);
      
      // Construct dateStr using local timezone
      const year = gregorianDate.getFullYear();
      const month = String(gregorianDate.getMonth() + 1).padStart(2, '0');
      const day = String(gregorianDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const ethiopianDate = gregorianToEthiopian(gregorianDate);
      
      // Find records for this specific day
      const dayRecords = attendance.filter(a => a.date === dateStr);
      const presentCount = dayRecords.filter(a => a.status === "present").length;
      const absentCount = dayRecords.filter(a => a.status === "absent").length;
      
      return {
        name: ethiopianDays[gregorianDate.getDay()],
        present: presentCount,
        absent: absentCount,
        ethiopianDate: formatEthiopianDate(ethiopianDate)
      };
    });
  }

  if (dateFilter === "custom" && dateRange?.from) {
    // Convert Ethiopian date range to Gregorian for iteration
    const fromGregorian = ethiopianToGregorian(
      parseInt(dateRange.from.split('-')[0]),
      parseInt(dateRange.from.split('-')[1]),
      parseInt(dateRange.from.split('-')[2])
    );
    
    const toGregorian = dateRange.to 
      ? ethiopianToGregorian(
          parseInt(dateRange.to.split('-')[0]),
          parseInt(dateRange.to.split('-')[1]),
          parseInt(dateRange.to.split('-')[2])
        )
      : fromGregorian;
    
    const daysDiff = Math.ceil(Math.abs(toGregorian.getTime() - fromGregorian.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create a bar for each day in the selected range
    return Array.from({ length: daysDiff + 1 }).map((_, i) => {
      const currentDate = new Date(fromGregorian);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Format local date string
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const ethiopianDate = gregorianToEthiopian(currentDate);
      const dayRecords = attendance.filter(a => a.date === dateStr);
      
      return {
        name: formatEthiopianDate(ethiopianDate), // Use Ethiopian date format
        present: dayRecords.filter(a => a.status === "present").length,
        absent: dayRecords.filter(a => a.status === "absent").length
      };
    });
  }

  // For 'month', show the current Ethiopian month
  const currentEthiopian = getCurrentEthiopianDate();
  const ethiopianMonthNames = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"
  ];
  
  return [
    {
      name: ethiopianMonthNames[currentEthiopian.ethiopian_month - 1],
      present: attendance.filter(a => a.status === "present").length,
      absent: attendance.filter(a => a.status === "absent").length,
    }
  ];
}

export function generateClassTableData(
  classes: any[],
  classUstaz: any[],
  ustaz: any[],
  students: any[],
  filteredAttendance: AttendanceRecord[]
): ClassTableData[] {
  return classes.map(cls => {
    // Find Ustaz via ClassUstaz relationship
    const assignment = classUstaz?.find(cu => cu.class_id === cls.id);
    const assignedUstaz = assignment ? ustaz.find(u => u.id === assignment.ustaz_id) : null;
    const ustazName = assignedUstaz ? assignedUstaz.full_name : "Unassigned";

    // Count students in this class
    const classStudentsCount = students.filter(s => s.class_id === cls.id).length;

    // Calculate class-specific attendance counts
    const classAttendance = filteredAttendance.filter(a => a.class_id === cls.id);
    const totalPresent = classAttendance.filter(a => a.status === "present").length;
    const totalAbsent = classAttendance.filter(a => a.status === "absent").length;

    return {
      id: cls.id,
      name: cls.name,
      ustaz: ustazName,
      studentsCount: classStudentsCount,
      totalPresent,
      totalAbsent
    };
  });
}
