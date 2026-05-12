import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { EthiopianDateRangePicker, EthiopianDateRange } from "@/components/ui/ethiopian-date-range-picker";
import { formatEthiopianDate } from "@/lib/utils/ethiopian-date";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/hooks/useAttendanceFilter";

interface DateFilterButtonsProps {
  dateFilter: DateFilter;
  dateRange: EthiopianDateRange | undefined;
  onDateFilterChange: (filter: DateFilter) => void;
  onDateRangeChange: (range: EthiopianDateRange | undefined) => void;
}

export default function DateFilterButtons({
  dateFilter,
  dateRange,
  onDateFilterChange,
  onDateRangeChange
}: DateFilterButtonsProps) {
  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg p-1 shadow-sm overflow-x-auto max-w-full">
      <Button 
        variant={dateFilter === "week" ? "secondary" : "ghost"} 
        size="sm" 
        onClick={() => onDateFilterChange("week")}
      >
        This Week
      </Button>
      <Button 
        variant={dateFilter === "month" ? "secondary" : "ghost"} 
        size="sm" 
        onClick={() => onDateFilterChange("month")}
      >
        This Month
      </Button>

      {/* Ethiopian Date Range Picker */}
      <div className={cn(
        "flex items-center gap-2 justify-start text-left font-normal",
        dateFilter === "custom" && !dateRange && "text-muted-foreground"
      )}>
        <Button 
          variant={dateFilter === "custom" ? "secondary" : "ghost"} 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => onDateFilterChange("custom")}
        >
          <CalendarIcon className="h-4 w-4" />
          {dateFilter === "custom" && dateRange?.from ? (
            dateRange.to ? (
              <>
                {formatEthiopianDate({
                  ethiopian_year: parseInt(dateRange.from.split('-')[0]),
                  ethiopian_month: parseInt(dateRange.from.split('-')[1]),
                  ethiopian_day: parseInt(dateRange.from.split('-')[2]),
                  ethiopian_date: dateRange.from
                })} - {formatEthiopianDate({
                  ethiopian_year: parseInt(dateRange.to.split('-')[0]),
                  ethiopian_month: parseInt(dateRange.to.split('-')[1]),
                  ethiopian_day: parseInt(dateRange.to.split('-')[2]),
                  ethiopian_date: dateRange.to
                })}
              </>
            ) : (
              formatEthiopianDate({
                ethiopian_year: parseInt(dateRange.from.split('-')[0]),
                ethiopian_month: parseInt(dateRange.from.split('-')[1]),
                ethiopian_day: parseInt(dateRange.from.split('-')[2]),
                ethiopian_date: dateRange.from
              })
            )
          ) : (
            <span>Custom</span>
          )}
        </Button>
        
        {dateFilter === "custom" && (
          <EthiopianDateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select Ethiopian date range"
            className="w-auto"
          />
        )}
      </div>
    </div>
  );
}
