"use client"
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Clock, Calendar, TrendingUp, ArrowRight, Plus, CheckSquare, School, BookOpen, Users2, Building, AlertCircle, Phone } from "lucide-react";
import { useData } from "@/context/dataContext";
import { isAuthenticated } from "@/lib/auth";
import { attendanceService } from "@/lib/servies/attendanceService";

export default function StudentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);
  const { students, attendance, ustaz, classes, loading, error, refreshData } = useData();
const [studentStatsMap, setStudentStatsMap] = useState<Record<string, any>>({});
const [statsLoading, setStatsLoading] = useState(true);


// 1. Fetch accurate stats from the DB on load
useEffect(() => {
  async function loadStats() {
    try {
      const stats = await attendanceService.getAllStudentStats();
      setStudentStatsMap(stats);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setStatsLoading(false);
    }
  }
  loadStats();
}, []);

// 2. Process students using the fetched stats


const processedStudents = useMemo(() => {
  return students
    .filter(s => s.is_active)
    .map(student => {
      const stats = studentStatsMap[student.id] || { present: 0, absent: 0, late: 0, total: 0 };
      
      const presentPct = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
      
      // LOGIC: 4 absent in last 20 OR 10 late in last 20
      // Note: stats.total will be at most 20 based on our service update
      const needsCommunication = (stats.absent >= 4) || (stats.late >= 10);
      
      let reason = "";
      if (stats.absent >= 4) {
        reason = `Need Parent Communication (Absents: ${stats.absent}/${stats.total})`;
      } else if (stats.late >= 10) {
        reason = `Need Parent Communication (Lates: ${stats.late}/${stats.total})`;
      }

      return {
        ...student,
        stats: { ...stats, presentPct, needsCommunication, reason }
      };
    });
}, [students, studentStatsMap]);

  // Calculate statistics
  const totalStudents = students.filter(s => s.is_active).length;
  const totalUstaz = ustaz.filter(u => u.is_active).length;
  const activeClasses = classes.length;
  
  // Today's attendance statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
  const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;


  // Helper function to get class name by ID
  const getClassName = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };
  // Separate the lists
  const attentionRequired = processedStudents.filter(s => s.stats.needsCommunication);
  const goodStanding = processedStudents.filter(s => !s.stats.needsCommunication && s.stats.total > 0);


  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading dashboard data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-600">Error: {error}</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-background mb-1">
                Dashboard Overview
              </h2>
              <p className="font-body-sm text-body-sm">
                Assalamu alaikum, here is the summary for today.
              </p>
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1 - Total Students */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <Badge variant="secondary" className="mt-2">
                  ACTIVE
                </Badge>
              </CardContent>
            </Card>

            {/* Card 2 - Total Ustaz */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ustaz
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUstaz}</div>
              </CardContent>
            </Card>

            {/* Card 3 - Today Attendance */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today Attendance
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{presentCount}</div>
                  <span className="text-sm text-muted-foreground">/ {totalStudents}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {attendanceRate.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={attendanceRate} className="mt-3" />
              </CardContent>
            </Card>

            {/* Card 4 - Active Classes */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Classes
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Building className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeClasses}</div>
              </CardContent>
            </Card>
          </div>

          {/* Bento Layout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Table Section (Span 2) */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900">Need Parent Communication</h2>
                <p className="text-sm text-muted-foreground">Students who have reached 4 absent or 10 late arrivals within 20 records.</p>
              </div>
            </div>

            <Card className="border-red-200 shadow-md">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-red-50">
                  <TableRow>
    <TableHead className="font-bold text-red-900">Student</TableHead>
    <TableHead>Class</TableHead>
    <TableHead className="text-center">Absents (Last 20)</TableHead>
    <TableHead className="text-center">Lates (Last 20)</TableHead>
    <TableHead className="text-red-700">Status</TableHead>
  </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attentionRequired.length > 0 ? (
                      attentionRequired.map((s) => (
                        <TableRow key={s.id} className="hover:bg-red-50/50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/students/${s.id}`} className="hover:text-primary hover:underline cursor-pointer">
                                {s.full_name}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>{getClassName(s.class_id || '')}</TableCell>
                         <TableCell className="text-center">
  <Badge variant="destructive" className="rounded-full">
    {s.stats.absent} / {s.stats.total}
  </Badge>
</TableCell>
<TableCell className="text-center">
  <Badge variant="secondary" className="bg-orange-100 text-orange-700 rounded-full">
    {s.stats.late} / {s.stats.total}
  </Badge>
</TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold text-red-600 italic underline decoration-red-200">
                              {s.stats.reason}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No students require immediate communication. Great job!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

            {/* Side Info Widget */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Present</span>
                    </div>
                    <span className="text-sm font-medium">
                      {totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-muted-foreground">Late</span>
                    </div>
                    <span className="text-sm font-medium">
                      {totalStudents > 0 ? ((lateCount / totalStudents) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm text-muted-foreground">Absent</span>
                    </div>
                    <span className="text-sm font-medium">
                      {totalStudents > 0 ? ((absentCount / totalStudents) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-border relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Building className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2 relative z-10">Today's Reminder</h4>
                  <p className="text-sm text-muted-foreground relative z-10 italic">
                    "Seeking knowledge is an obligation upon every Muslim."
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}