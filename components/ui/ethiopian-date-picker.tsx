"use client";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentEthiopianDate, formatEthiopianDate, createEthiopianDateString, EthiopianDateComponents } from "@/lib/utils/ethiopian-date";
import EthiopianCalendar from "ethiopian-calendar-new";

interface EthiopianDatePickerProps {
  id?: string;
  value?: string; // YYYY-MM-DD Ethiopian date format
  onChange?: (date: string, ethiopianComponents: EthiopianDateComponents) => void;
  placeholder?: string;
  className?: string;
}

const ethiopianMonths = [
  "Meskerem", "Tikimet", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehasse", "Pagumen"
];

export function EthiopianDatePicker({
  value,
  onChange,
  placeholder = "Select Ethiopian date",
  className
}: EthiopianDatePickerProps) {
  const [open, setOpen] = useState(false);
  const currentDate = getCurrentEthiopianDate();
  
  // Parse the current value or use current date
  let selectedYear = currentDate.ethiopian_year;
  let selectedMonth = currentDate.ethiopian_month;
  let selectedDay = currentDate.ethiopian_day;
  
  if (value) {
    const parts = value.split('-');
    if (parts.length === 3) {
      selectedYear = parseInt(parts[0]);
      selectedMonth = parseInt(parts[1]);
      selectedDay = parseInt(parts[2]);
    }
  }
  
  const [displayYear, setDisplayYear] = useState(selectedYear);
  const [displayMonth, setDisplayMonth] = useState(selectedMonth);
  
  // Get days in Ethiopian month
  const getDaysInMonth = (year: number, month: number) => {
    if (month === 13) { // Pagumen
      return EthiopianCalendar.isEthiopianLeapYear(year) ? 6 : 5;
    }
    return 30;
  };
  
  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  
  const handleDateSelect = (day: number) => {
    const ethiopianDate = createEthiopianDateString(displayYear, displayMonth, day);
    const ethiopianComponents = {
      ethiopian_day: day,
      ethiopian_month: displayMonth,
      ethiopian_year: displayYear,
      ethiopian_date: ethiopianDate
    };
    
    onChange?.(ethiopianDate, ethiopianComponents);
    setOpen(false);
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
    return day === selectedDay && displayMonth === selectedMonth && displayYear === selectedYear;
  };
  
  const isToday = (day: number) => {
    return day === currentDate.ethiopian_day && 
           displayMonth === currentDate.ethiopian_month && 
           displayYear === currentDate.ethiopian_year;
  };
  
  const displayText = value ? formatEthiopianDate({
    ethiopian_day: selectedDay,
    ethiopian_month: selectedMonth,
    ethiopian_year: selectedYear,
    ethiopian_date: value
  }) : placeholder;

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
              <Input
                type="number"
                value={displayYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value) || displayYear)}
                className="w-20 h-8 text-center"
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
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}
            
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <Button
                key={day}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  isSelectedDate(day) && "bg-primary text-primary-foreground",
                  isToday(day) && !isSelectedDate(day) && "bg-secondary",
                  !isSelectedDate(day) && !isToday(day) && "hover:bg-muted"
                )}
                onClick={() => handleDateSelect(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
