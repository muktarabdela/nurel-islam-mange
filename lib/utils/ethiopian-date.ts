import EthiopianCalendar from 'ethiopian-calendar-new';

export interface EthiopianDate {
  day: number;
  month: number;
  year: number;
  date: string; // YYYY-MM-DD format
}

export interface EthiopianDateComponents {
  ethiopian_day: number;
  ethiopian_month: number;
  ethiopian_year: number;
  ethiopian_date: string;
}

/**
 * Convert Gregorian date to Ethiopian date
 */
export function gregorianToEthiopian(gregorianDate: Date | string): EthiopianDateComponents {
  const date = typeof gregorianDate === 'string' ? new Date(gregorianDate) : gregorianDate;
  const ethDate = EthiopianCalendar.toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
  
  const ethiopian_date = `${ethDate.year}-${String(ethDate.month).padStart(2, '0')}-${String(ethDate.day).padStart(2, '0')}`;
  
  return {
    ethiopian_day: ethDate.day,
    ethiopian_month: ethDate.month,
    ethiopian_year: ethDate.year,
    ethiopian_date
  };
}

/**
 * Convert Ethiopian date to Gregorian date
 */
export function ethiopianToGregorian(ethiopianYear: number, ethiopianMonth: number, ethiopianDay: number): Date {
  const gregDate = EthiopianCalendar.toGregorian(ethiopianYear, ethiopianMonth, ethiopianDay);
  return new Date(gregDate.year, gregDate.month - 1, gregDate.day);
}

/**
 * Get current Ethiopian date
 */
export function getCurrentEthiopianDate(): EthiopianDateComponents {
  return gregorianToEthiopian(new Date());
}

/**
 * Format Ethiopian date for display
 */
export function formatEthiopianDate(ethiopianDate: EthiopianDateComponents): string {
  const monthNames = [
    'Meskerem', 'Tikimet', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 
    'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagumen'
  ];
  
  return `${monthNames[ethiopianDate.ethiopian_month - 1]} ${ethiopianDate.ethiopian_day}, ${ethiopianDate.ethiopian_year}`;
}

/**
 * Create Ethiopian date string in YYYY-MM-DD format
 */
export function createEthiopianDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
