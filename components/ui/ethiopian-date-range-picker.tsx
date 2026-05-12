"use client";
import { useState } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getCurrentEthiopianDate, 
  formatEthiopianDate, 
  createEthiopianDateString, 
  EthiopianDateComponents,
  ethiopianToGregorian,
  gregorianToEthiopian
} from "@/lib/utils/ethiopian-date";
import EthiopianCalendar from "ethiopian-calendar-new";

export interface EthiopianDateRange {
  from?: string; // Ethiopian date in YYYY-MM-DD format
  to?: string;   // Ethiopian date in YYYY-MM-DD format
}

interface EthiopianDateRangePickerProps {
  value?: EthiopianDateRange;
  onChange?: (range: EthiopianDateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

const ethiopianMonths = [
  "Meskerem", "Tikimet", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehasse", "Pagumen"
];

export function EthiopianDateRangePicker({
  value,
  onChange,
  placeholder = "Select Ethiopian date range",
  className
}: EthiopianDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const currentDate = getCurrentEthiopianDate();
  
  // Parse the current value or use current date
  let selectedFromYear = currentDate.ethiopian_year;
  let selectedFromMonth = currentDate.ethiopian_month;
  let selectedFromDay = currentDate.ethiopian_day;
  let selectedToYear = currentDate.ethiopian_year;
  let selectedToMonth = currentDate.ethiopian_month;
  let selectedToDay = currentDate.ethiopian_day;
  
  if (value?.from) {
    const parts = value.from.split('-');
    if (parts.length === 3) {
      selectedFromYear = parseInt(parts[0]);
      selectedFromMonth = parseInt(parts[1]);
      selectedFromDay = parseInt(parts[2]);
    }
  }
  
  if (value?.to) {
    const parts = value.to.split('-');
    if (parts.length === 3) {
      selectedToYear = parseInt(parts[0]);
      selectedToMonth = parseInt(parts[1]);
      selectedToDay = parseInt(parts[2]);
    }
  }
  
  const [displayYear, setDisplayYear] = useState(selectedFromYear);
  const [displayMonth, setDisplayMonth] = useState(selectedFromMonth);
  const [selectingTo, setSelectingTo] = useState(false);
  
  // Get days in Ethiopian month
  const getDaysInMonth = (year: number, month: number) => {
    if (month === 13) { // Pagumen
      return EthiopianCalendar.isEthiopianLeapYear(year) ? 6 : 5;
    }
    return 30;
  };
  
  const daysInMonth = getDaysInMonth(displayYear, displayMonth);

  // Get starting day of the week for the current month
  const getStartingDayOfWeek = (year: number, month: number) => {
    const gregorianDate = ethiopianToGregorian(year, month, 1);
    return gregorianDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  };

  const startingDay = getStartingDayOfWeek(displayYear, displayMonth);
  
  const handleDateSelect = (day: number) => {
    const ethiopianDate = createEthiopianDateString(displayYear, displayMonth, day);
    
    if (!selectingTo) {
      // Selecting "from" date
      const newRange: EthiopianDateRange = { from: ethiopianDate };
      onChange?.(newRange);
      setSelectingTo(true);
    } else {
      // Selecting "to" date
      const currentFrom = value?.from;
      if (currentFrom) {
        // Compare dates to ensure proper ordering
        const fromDate = ethiopianToGregorian(
          parseInt(currentFrom.split('-')[0]),
          parseInt(currentFrom.split('-')[1]),
          parseInt(currentFrom.split('-')[2])
        );
        const toDate = ethiopianToGregorian(displayYear, displayMonth, day);
        
        if (toDate >= fromDate) {
          onChange?.({ from: currentFrom, to: ethiopianDate });
        } else {
          // Swap dates if "to" is before "from"
          onChange?.({ from: ethiopianDate, to: currentFrom });
        }
      }
      setSelectingTo(false);
      setOpen(false);
    }
  };
  
  const handlePreviousMonth = () => {
    if (displayMonth === 1) {
      setDisplayMonth(13);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (displayMonth === 13) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };
  
  const handleYearChange = (year: number) => {
    setDisplayYear(year);
  };
  
  const isSelectedDate = (day: number) => {
    const currentDateStr = createEthiopianDateString(displayYear, displayMonth, day);
    
    if (value?.from && currentDateStr === value.from) return true;
    if (value?.to && currentDateStr === value.to) return true;
    
    // Check if date is in range
    if (value?.from && value?.to) {
      const testDate = ethiopianToGregorian(displayYear, displayMonth, day);
      const fromDate = ethiopianToGregorian(
        parseInt(value.from.split('-')[0]),
        parseInt(value.from.split('-')[1]),
        parseInt(value.from.split('-')[2])
      );
      const toDate = ethiopianToGregorian(
        parseInt(value.to.split('-')[0]),
        parseInt(value.to.split('-')[1]),
        parseInt(value.to.split('-')[2])
      );
      
      return testDate >= fromDate && testDate <= toDate;
    }
    
    return false;
  };
  
  const isToday = (day: number) => {
    return day === currentDate.ethiopian_day && 
           displayMonth === currentDate.ethiopian_month && 
           displayYear === currentDate.ethiopian_year;
  };
  
  const isRangeStart = (day: number) => {
    if (!value?.from) return false;
    const currentDateStr = createEthiopianDateString(displayYear, displayMonth, day);
    return currentDateStr === value.from;
  };
  
  const isRangeEnd = (day: number) => {
    if (!value?.to) return false;
    const currentDateStr = createEthiopianDateString(displayYear, displayMonth, day);
    return currentDateStr === value.to;
  };
  
  const isInRange = (day: number) => {
    if (!value?.from || !value?.to) return false;
    
    const testDate = ethiopianToGregorian(displayYear, displayMonth, day);
    const fromDate = ethiopianToGregorian(
      parseInt(value.from.split('-')[0]),
      parseInt(value.from.split('-')[1]),
      parseInt(value.from.split('-')[2])
    );
    const toDate = ethiopianToGregorian(
      parseInt(value.to.split('-')[0]),
      parseInt(value.to.split('-')[1]),
      parseInt(value.to.split('-')[2])
    );
    
    return testDate > fromDate && testDate < toDate;
  };
  
  const displayText = value?.from ? (
    value.to ? (
      <>
        {formatEthiopianDate({
          ethiopian_year: parseInt(value.from.split('-')[0]),
          ethiopian_month: parseInt(value.from.split('-')[1]),
          ethiopian_day: parseInt(value.from.split('-')[2]),
          ethiopian_date: value.from
        })} - {formatEthiopianDate({
          ethiopian_year: parseInt(value.to.split('-')[0]),
          ethiopian_month: parseInt(value.to.split('-')[1]),
          ethiopian_day: parseInt(value.to.split('-')[2]),
          ethiopian_date: value.to
        })}
      </>
    ) : (
      formatEthiopianDate({
        ethiopian_year: parseInt(value.from.split('-')[0]),
        ethiopian_month: parseInt(value.from.split('-')[1]),
        ethiopian_day: parseInt(value.from.split('-')[2]),
        ethiopian_date: value.from
      })
    )
  ) : (
    placeholder
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          {/* Header with month/year navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {ethiopianMonths[displayMonth - 1]}
              </span>
              <input
                type="number"
                value={displayYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value) || displayYear)}
                className="w-20 h-8 text-center border rounded px-2"
                min={1900}
                max={2100}
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Selection indicator */}
          <div className="text-center text-sm text-muted-foreground">
            {selectingTo ? "Select end date" : "Select start date"}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
            
            {/* NEW: Empty cells to align the first day of the month */}
            {Array.from({ length: startingDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-8 w-8 p-0" />
            ))}
            
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <Button
                key={day}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 relative",
                  isRangeStart(day) && "bg-primary text-primary-foreground rounded-l-md",
                  isRangeEnd(day) && "bg-primary text-primary-foreground rounded-r-md",
                  isInRange(day) && "bg-primary/20",
                  isSelectedDate(day) && !isRangeStart(day) && !isRangeEnd(day) && "bg-primary text-primary-foreground",
                  isToday(day) && !isSelectedDate(day) && "bg-secondary",
                  !isSelectedDate(day) && !isToday(day) && !isInRange(day) && "hover:bg-muted"
                )}
                onClick={() => handleDateSelect(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          
          {/* Clear button */}
          {value && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  onChange?.(undefined);
                  setSelectingTo(false);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}