"use client";

import { useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import SummaryTab from "@/components/SummaryTab";

// Custom hooks
import { useAttendanceFilter } from "@/hooks/useAttendanceFilter";

// Utility functions
import { 
  calculateAttendanceMetrics, 
  generateChartData, 
  generateClassTableData 
} from "@/utils/reportsUtils";

// Components
import MetricCard from "@/components/reports/MetricCard";
import DateFilterButtons from "@/components/reports/DateFilterButtons";
import AttendanceChart from "@/components/reports/AttendanceChart";
import ClassAttendanceTable from "@/components/reports/ClassAttendanceTable";

// Context
import { useData } from "@/context/dataContext";

export default function ReportsPage() {
  const { students, attendance, ustaz, classes, classUstaz, loading } = useData();
  
  // Use custom hook for date filtering
  const {
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    filteredAttendance
  } = useAttendanceFilter(attendance);
// Calculate metrics using utility function
  const metrics = useMemo(() => {
    return calculateAttendanceMetrics(filteredAttendance);
  }, [filteredAttendance]);

  // Generate chart data using utility function
  const chartData = useMemo(() => {
    return generateChartData(filteredAttendance, dateFilter, dateRange);
  }, [filteredAttendance, dateFilter, dateRange]);

  // Generate table data using utility function
  const tableData = useMemo(() => {
    return generateClassTableData(classes, classUstaz, ustaz, students, filteredAttendance);
  }, [classes, classUstaz, ustaz, students, filteredAttendance]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Canvas */}
        <main className="flex-1 p-8 lg:p-xl overflow-y-auto w-full max-w-[1440px] mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">Reports and Analytics</h2>
              <p className="font-body-md text-body-md mt-1 text-muted-foreground">
                View comprehensive attendance data and trends.
              </p>
            </div>
            
            {/* Date Range Picker */}
            <DateFilterButtons
              dateFilter={dateFilter}
              dateRange={dateRange}
              onDateFilterChange={setDateFilter}
              onDateRangeChange={setDateRange}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="student-attendance" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="student-attendance">Student Attendance</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student-attendance" className="space-y-8 mt-6">

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Card */}
                <AttendanceChart data={chartData} />

                {/* Summary Cards */}
                <div className="flex flex-col gap-6">
                  <MetricCard
                    title="Average Attendance Rate"
                    value={`${metrics.avgAttendanceRate}%`}
                    subtitle={`Based on ${dateFilter} filters`}
                    trend={{ value: "+2.1%", direction: "up" }}
                  />
                  
                  <MetricCard
                    title="Total Absences"
                    value={metrics.absentCount}
                    subtitle={`Recorded this ${dateFilter}`}
                    trend={{ value: "-1.4%", direction: "down" }}
                  />
                </div>
              </div>

              {/* Data Table */}
              <ClassAttendanceTable data={tableData} />

            </TabsContent>
            
            <TabsContent value="summary">
              <SummaryTab />
            </TabsContent>
          </Tabs>

        </main>
      </div>
    </div>
  );
}