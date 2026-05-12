"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, UserX, TrendingUp, Calendar, Award } from "lucide-react";
import { useData } from "@/context/dataContext";

interface SummaryMetrics {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  totalUstaz: number;
  totalAttendanceRecords: number;
  overallAttendanceRate: number;
  mostAttendedClass: {
    name: string;
    rate: number;
  } | null;
  leastAttendedClass: {
    name: string;
    rate: number;
  } | null;
  dailyAverageAttendance: {
    present: number;
    absent: number;
  };
}

export default function SummaryTab() {
  const { students, classes, ustaz, attendance } = useData();

  const metrics = useMemo((): SummaryMetrics => {
    // Basic counts
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.is_active).length;
    const totalClasses = classes.length;
    const totalUstaz = ustaz.length;
    const totalAttendanceRecords = attendance.length;

    // Overall attendance rate
    const presentRecords = attendance.filter(a => a.status === "present").length;
    const overallAttendanceRate = totalAttendanceRecords > 0 
      ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
      : 0;

    // Class-specific attendance rates
    const classAttendanceRates = classes.map(cls => {
      const classAttendance = attendance.filter(a => a.class_id === cls.id);
      const classPresent = classAttendance.filter(a => a.status === "present").length;
      const classTotal = classAttendance.length;
      const rate = classTotal > 0 ? Math.round((classPresent / classTotal) * 100) : 0;
      
      return {
        name: cls.name,
        rate,
        totalRecords: classTotal
      };
    }).filter(cls => cls.totalRecords > 0); // Only include classes with attendance data

    // Find most and least attended classes
    const classesWithAttendance = classAttendanceRates.filter(cls => cls.rate > 0);
    
    const mostAttendedClass = classesWithAttendance.length > 0 
      ? classesWithAttendance.reduce((prev, current) => prev.rate > current.rate ? prev : current)
      : null;

    const leastAttendedClass = classAttendanceRates.length > 0 
      ? classAttendanceRates.reduce((prev, current) => prev.rate < current.rate ? prev : current)
      : null;

    // Daily average attendance (simplified - using overall averages)
    const dailyAverageAttendance = {
      present: Math.round(presentRecords / Math.max(1, new Set(attendance.map(a => a.date)).size)),
      absent: Math.round(attendance.filter(a => a.status === "absent").length / Math.max(1, new Set(attendance.map(a => a.date)).size))
    };

    return {
      totalStudents,
      activeStudents,
      totalClasses,
      totalUstaz,
      totalAttendanceRecords,
      overallAttendanceRate,
      mostAttendedClass,
      leastAttendedClass,
      dailyAverageAttendance
    };
  }, [students, classes, ustaz, attendance]);

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceRateVariant = (rate: number): "default" | "secondary" | "destructive" => {
    if (rate >= 90) return "default";
    if (rate >= 75) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeStudents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalUstaz} ustaz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallAttendanceRate}%</div>
            <Progress value={metrics.overallAttendanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-green-600" />
                <span className="text-sm font-medium">{metrics.dailyAverageAttendance.present}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserX className="h-3 w-3 text-red-600" />
                <span className="text-sm font-medium">{metrics.dailyAverageAttendance.absent}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              present / absent per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.mostAttendedClass && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Best Attendance</p>
                  <p className="text-lg font-bold text-green-900">{metrics.mostAttendedClass.name}</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                  {metrics.mostAttendedClass.rate}%
                </Badge>
              </div>
            )}

            {metrics.leastAttendedClass && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-800">Needs Attention</p>
                  <p className="text-lg font-bold text-red-900">{metrics.leastAttendedClass.name}</p>
                </div>
                <Badge variant="destructive">
                  {metrics.leastAttendedClass.rate}%
                </Badge>
              </div>
            )}

            {!metrics.mostAttendedClass && !metrics.leastAttendedClass && (
              <p className="text-center text-muted-foreground py-4">
                No attendance data available yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="font-medium">{metrics.totalAttendanceRecords}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Present</span>
                <span className="font-medium text-green-600">
                  {attendance.filter(a => a.status === "present").length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Absent</span>
                <span className="font-medium text-red-600">
                  {attendance.filter(a => a.status === "absent").length}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Late</span>
                <span className="font-medium text-yellow-600">
                  {attendance.filter(a => a.status === "late").length}
                </span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Rate</span>
                  <Badge variant={getAttendanceRateVariant(metrics.overallAttendanceRate)}>
                    {metrics.overallAttendanceRate}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
