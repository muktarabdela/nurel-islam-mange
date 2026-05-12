import { useState, useMemo } from "react";
import { EthiopianDateRange } from "@/components/ui/ethiopian-date-range-picker";
import { 
  getCurrentEthiopianDate, 
  ethiopianToGregorian, 
  gregorianToEthiopian,
  EthiopianDateComponents 
} from "@/lib/utils/ethiopian-date";

export type DateFilter = "week" | "month" | "custom";

interface AttendanceRecord {
  date: string;
  ethiopian_date?: string;
  status: string;
  class_id?: string;
}

export function useAttendanceFilter(attendance: AttendanceRecord[]) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const currentEthiopianDate = getCurrentEthiopianDate();
  
  // Calculate Ethiopian date 7 days ago
  const sevenDaysAgoGregorian = new Date();
  sevenDaysAgoGregorian.setDate(sevenDaysAgoGregorian.getDate() - 7);
  const sevenDaysAgoEthiopian = gregorianToEthiopian(sevenDaysAgoGregorian);
  
  const [dateRange, setDateRange] = useState<EthiopianDateRange | undefined>({
    from: `${sevenDaysAgoEthiopian.ethiopian_year}-${String(sevenDaysAgoEthiopian.ethiopian_month).padStart(2, '0')}-${String(sevenDaysAgoEthiopian.ethiopian_day).padStart(2, '0')}`,
    to: `${currentEthiopianDate.ethiopian_year}-${String(currentEthiopianDate.ethiopian_month).padStart(2, '0')}-${String(currentEthiopianDate.ethiopian_day).padStart(2, '0')}`,
  });

  const filteredAttendance = useMemo(() => {
    const currentEthiopian = getCurrentEthiopianDate();
    return attendance.filter((record) => {
      // Use Ethiopian date from the attendance record if available, otherwise convert from Gregorian
      let recordEthiopianDate: EthiopianDateComponents;
      if (record.ethiopian_date) {
        const parts = record.ethiopian_date.split('-');
        recordEthiopianDate = {
          ethiopian_year: parseInt(parts[0]),
          ethiopian_month: parseInt(parts[1]),
          ethiopian_day: parseInt(parts[2]),
          ethiopian_date: record.ethiopian_date
        };
      } else {
        // Fallback: convert from Gregorian date
        recordEthiopianDate = gregorianToEthiopian(record.date);
      }
      
      if (dateFilter === "week") {
        // Calculate the current week (Starting from Monday to Sunday)
        const recordGregorian = new Date(record.date);
        recordGregorian.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
        const diffToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return recordGregorian >= startOfWeek && recordGregorian <= endOfWeek;
      } 
      
      if (dateFilter === "month") {
        // Current Ethiopian month
        return (
          recordEthiopianDate.ethiopian_month === currentEthiopian.ethiopian_month &&
          recordEthiopianDate.ethiopian_year === currentEthiopian.ethiopian_year
        );
      }
      
      if (dateFilter === "custom" && dateRange?.from) {
        // Convert Ethiopian dates to Gregorian for comparison
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

        const recordGregorian = new Date(record.date);
        
        // Set times to midnight for accurate comparison
        fromGregorian.setHours(0, 0, 0, 0);
        toGregorian.setHours(0, 0, 0, 0);
        recordGregorian.setHours(0, 0, 0, 0);

        return recordGregorian >= fromGregorian && recordGregorian <= toGregorian;
      }
      
      return true;
    });
  }, [attendance, dateFilter, dateRange]);

  return {
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    filteredAttendance
  };
}
