"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Clock, Calendar, TrendingUp, ArrowRight, Plus, CheckSquare, School, BookOpen, Users2, Building } from "lucide-react";
import { useData } from "@/context/dataContext";
import { isAuthenticated } from "@/lib/auth";

export default function StudentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);
  const { students, attendance, ustaz, classes, loading, error, refreshData } = useData();

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

  // Get recent attendance records (last 10)
  const recentAttendance = attendance
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Helper function to get student initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Helper function to get student name by ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.full_name : 'Unknown Student';
  };

  // Helper function to get class name by ID
  const getClassName = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">PRESENT</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">LATE</Badge>;
      case 'absent':
        return <Badge variant="destructive">ABSENT</Badge>;
      default:
        return <Badge variant="secondary">{status.toUpperCase()}</Badge>;
    }
  };

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
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Recent Attendance</CardTitle>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAttendance.length > 0 ? (
                      recentAttendance.map((record) => {
                        const studentName = getStudentName(record.student_id);
                        const className = getClassName(record.class_id);
                        const initials = getInitials(studentName);
                        const time = new Date(record.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        });
                        
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {initials}
                              </div>
                              <span className="font-medium">{studentName}</span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{className}</TableCell>
                            <TableCell className="text-muted-foreground">{time}</TableCell>
                            <TableCell>
                              {getStatusBadge(record.status)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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