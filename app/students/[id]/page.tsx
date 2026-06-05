"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Edit, Mail, Calendar, CheckCircle, X, BookOpen, Plus, Info, CalendarDays, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { useData } from "@/context/dataContext";
import { formatEthiopianDate, getCurrentEthiopianDate, EthiopianDateComponents } from "@/lib/utils/ethiopian-date";
import { useState, useMemo, useEffect } from "react";
import { attendanceService } from "@/lib/servies/attendanceService";
import { studentService } from "@/lib/servies/studentService";

const ETHIOPIAN_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
];

// Helper to get days in an Ethiopian month
const getDaysInEthiopianMonth = (month: number, year: number) => {
  if (month === 13) {
    return year % 4 === 3 ? 6 : 5;
  }
  return 30; 
};

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;

  const { students, attendance, classes, behaviorNotes, loading } = useData();
  
  const [localAttendance, setLocalAttendance] = useState<any[]>([]);
  const [fetchingLocal, setFetchingLocal] = useState(false);
  const [selectedEthiopianMonth, setSelectedEthiopianMonth] = useState<EthiopianDateComponents>(getCurrentEthiopianDate());
  const [updatingPayment, setUpdatingPayment] = useState(false);
  
  // Get student data
  const student = students.find(s => 
    s.id?.toString().trim() === studentId?.toString().trim()
  );
  const studentClass = classes.find(c => 
    c.id?.toString().trim() === student?.class_id?.toString().trim()
  );
  
  // Get student's attendance specifically for this student
useEffect(() => {
  async function loadStudentData() {
    if (!studentId) return;
    setFetchingLocal(true);
    try {
      // Fetch specifically for this student to bypass the 1000 row limit
      const data = await attendanceService.getByStudentId(studentId);
      setLocalAttendance(data);
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setFetchingLocal(false);
    }
  }
  loadStudentData();
}, [studentId]);

// Use localAttendance instead of filtering the global context
const studentAttendance = localAttendance;
  

    const idExistsInGlobalList = attendance.some(a => String(a.student_id).includes(studentId));

  const studentBehaviorNotes = behaviorNotes.filter(n => 
    n.student_id?.toString().trim() === studentId?.toString().trim()
  ).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // FIX: Using Number() to explicitly prevent String vs Number strict equality failures
  const monthlyAttendance = useMemo(() => {
    return studentAttendance.filter(a => 
      Number(a.ethiopian_year) === Number(selectedEthiopianMonth.ethiopian_year) &&
      Number(a.ethiopian_month) === Number(selectedEthiopianMonth.ethiopian_month)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [studentAttendance, selectedEthiopianMonth]);
  
  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const present = monthlyAttendance.filter(a => a.status === 'present').length;
    const absent = monthlyAttendance.filter(a => a.status === 'absent').length;
    const late = monthlyAttendance.filter(a => a.status === 'late').length;
    const totalRecorded = monthlyAttendance.length;
    
    const attendanceRate = totalRecorded > 0 
      ? Math.round(((present + late) / totalRecorded) * 100) 
      : 0;

    return { present, absent, late, total: totalRecorded, rate: attendanceRate };
  }, [monthlyAttendance]);
  
  // Calculate total days for the visual grid
  const daysInSelectedMonth = getDaysInEthiopianMonth(
    selectedEthiopianMonth.ethiopian_month, 
    selectedEthiopianMonth.ethiopian_year
  );
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    setSelectedEthiopianMonth(prev => {
      if (prev.ethiopian_month === 1) {
        return { ...prev, ethiopian_month: 13, ethiopian_year: prev.ethiopian_year - 1 };
      }
      return { ...prev, ethiopian_month: prev.ethiopian_month - 1 };
    });
  };
  
  const handleNextMonth = () => {
    setSelectedEthiopianMonth(prev => {
      if (prev.ethiopian_month === 13) {
        return { ...prev, ethiopian_month: 1, ethiopian_year: prev.ethiopian_year + 1 };
      }
      return { ...prev, ethiopian_month: prev.ethiopian_month + 1 };
    });
  };

  const handleToggleSecondMonthPayment = async () => {
    if (!student) return;
    setUpdatingPayment(true);
    try {
      await studentService.update(student.id, {
        paid_second_month: !student.paid_second_month
      });
      // Refresh data to get updated student
      window.location.reload();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status');
    } finally {
      setUpdatingPayment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground animate-pulse">Loading student data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Student not found</p>
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

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarFallback className="text-2xl font-semibold">
                  {student.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-2">{student.full_name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">{studentClass?.name || 'No Class Assigned'}</span>
                  <span className="mx-2 text-muted-foreground hidden sm:inline">•</span>
                  <Badge variant={student.is_active ? "default" : "secondary"} className={student.is_active ? "bg-primary/10 text-primary hover:bg-primary/10" : ""}>
                    {student.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Section 1: Basic Information */}
            <Card className="h-fit sticky top-6">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Parent Contact</p>
                  <p className="text-base">{student.parent_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Parent Name</p>
                  <p className="text-base">{student.parent_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Father's Phone</p>
                  <p className="text-base">{student.father_phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mother's Phone</p>
                  <p className="text-base">{student.mother_phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Age</p>
                  <p className="text-base">{student.age || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                  <p className="text-base">{student.address || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Class</p>
                  <p className="text-base">{studentClass?.name || 'No Class Assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <p className="text-base">{student.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Joined Date</p>
                  <p className="text-base">{new Date(student.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status Card */}
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">First Month</p>
                    <p className="text-xs text-muted-foreground">Summer Project</p>
                  </div>
                  <Badge variant={student.paid_first_month ? "default" : "secondary"} className={student.paid_first_month ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                    {student.paid_first_month ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Second Month</p>
                    <p className="text-xs text-muted-foreground">Summer Project</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={student.paid_second_month ? "default" : "secondary"} className={student.paid_second_month ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                      {student.paid_second_month ? "Paid" : "Unpaid"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleSecondMonthPayment}
                      disabled={updatingPayment}
                      className="h-8 px-2"
                    >
                      {updatingPayment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Edit className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>

            {/* Main Column (Attendance & Notes) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Section 2: Enhanced Attendance History */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-6 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Attendance 
                    <span className="text-muted-foreground font-normal text-lg ml-1">
                      ({ETHIOPIAN_MONTHS[selectedEthiopianMonth.ethiopian_month - 1]} {selectedEthiopianMonth.ethiopian_year})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md">
                    <Button variant="ghost" size="sm" onClick={handlePreviousMonth} className="h-8">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>
                    <div className="w-[1px] h-4 bg-border mx-1"></div>
                    <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8">
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-8 pt-6">
                  {/* Attendance Statistics Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-3xl font-bold text-primary">{attendanceStats.rate}%</p>
                      <p className="text-xs font-medium text-primary/80 mt-1">Attendance Rate</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted border">
                      <p className="text-3xl font-bold">{attendanceStats.total}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Recorded Days</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                      <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
                      <p className="text-xs font-medium text-green-700 mt-1">Present</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-red-50 border border-red-100">
                      <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
                      <p className="text-xs font-medium text-red-700 mt-1">Absent</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                      <p className="text-3xl font-bold text-yellow-600">{attendanceStats.late}</p>
                      <p className="text-xs font-medium text-yellow-700 mt-1">Late</p>
                    </div>
                  </div>

                  {/* VISUAL MONTHLY GRID */}
                  <div>
                    <div className="flex flex-col items-center justify-between mb-3 sm:flex-row sm:items-start">
                      <h3 className="text-sm font-semibold flex items-center gap-2 sm:mb-0">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        Monthly Overview
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground sm:flex-row sm:justify-start">
                        <span className="flex items-center gap-1.5 sm:mb-0"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Present</span>
                        <span className="flex items-center gap-1.5 sm:mb-0"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Absent</span>
                        <span className="flex items-center gap-1.5 sm:mb-0"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div> Late</span>
                        <span className="flex items-center gap-1.5 sm:mb-0"><div className="w-2.5 h-2.5 rounded-full bg-muted border"></div> No Record</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-muted/20 p-4 rounded-xl border">
                      {Array.from({ length: daysInSelectedMonth }).map((_, i) => {
                        const dayNumber = i + 1;
                        // FIX: Added Number() around a.ethiopian_day here as well!
                        const record = monthlyAttendance.find(a => Number(a.ethiopian_day) === dayNumber);
                        
                        let bgColor = "bg-background border-border hover:bg-muted/50";
                        let icon = null;
                        
                        if (record?.status === 'present') {
                          bgColor = "bg-green-100 border-green-200 text-green-800";
                          icon = <CheckCircle className="h-4 w-4" />;
                        } else if (record?.status === 'absent') {
                          bgColor = "bg-red-100 border-red-200 text-red-800";
                          icon = <X className="h-4 w-4" />;
                        } else if (record?.status === 'late') {
                          bgColor = "bg-yellow-100 border-yellow-200 text-yellow-800";
                          icon = <Calendar className="h-4 w-4" />;
                        }

                        return (
                          <div 
                            key={dayNumber} 
                            className={`flex flex-col items-center justify-center p-2 h-16 rounded-lg border transition-colors ${bgColor}`}
                            title={record ? `Day ${dayNumber}: ${record.status}` : `Day ${dayNumber}: No record`}
                          >
                            <span className={`text-sm font-semibold mb-1 ${!record && "text-muted-foreground/50"}`}>
                              {dayNumber}
                            </span>
                            {icon ? icon : <span className="text-xs text-muted-foreground/30">-</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Attendance List */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Detailed Log</h3>
                    <div className="border rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[120px]">Ethiopian Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Gregorian Date</TableHead>
                            <TableHead className="text-right">Class</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthlyAttendance.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No specific attendance logs recorded for this month
                              </TableCell>
                            </TableRow>
                          ) : (
                            monthlyAttendance.map((record) => {
                              const attendanceClass = classes.find(c => c.id === record.class_id);
                              return (
                                <TableRow key={record.id} className="hover:bg-muted/20">
                                  <TableCell className="font-medium">
                                    {ETHIOPIAN_MONTHS[Number(record.ethiopian_month) - 1]} {record.ethiopian_day}
                                  </TableCell>
                                  <TableCell>
                                    {record.status === 'present' && (
                                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-none">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Present
                                      </Badge>
                                    )}
                                    {record.status === 'absent' && (
                                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-none">
                                        <X className="h-3 w-3 mr-1" /> Absent
                                      </Badge>
                                    )}
                                    {record.status === 'late' && (
                                      <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-none">
                                        <Calendar className="h-3 w-3 mr-1" /> Late
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">
                                    {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm text-right">
                                    {attendanceClass?.name || '—'}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Section 3: Behavior Notes */}
              <Card>
                {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Behavior & Progress Notes
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="space-y-4">
                  {/* Notes List */}
                  {/* <div className="space-y-4 mb-6">
                    {studentBehaviorNotes.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No behavior notes recorded</p>
                    ) : (
                      studentBehaviorNotes.map((note) => (
                        <div key={note.id} className={`p-4 rounded-lg border ${note.type === 'good' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold">
                                {note.type === 'good' ? 'Positive Note' : 'Issue Note'}
                              </span>
                              <Badge variant={note.type === 'good' ? 'default' : 'destructive'} className="px-2 py-0.5">
                                {note.type === 'good' ? 'Good' : 'Issue'}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {new Date(note.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.note}</p>
                        </div>
                      ))
                    )}
                  </div> */}

                  {/* Add Note Form */}
                  {/* <div className="border-t pt-4">
                    <h4 className="text-base font-semibold mb-3">Add New Note</h4>
                    <form className="flex flex-col gap-3">
                      <Textarea 
                        placeholder="Write a note regarding behavior, progress, or general observation..." 
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button type="submit" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Save Note
                        </Button>
                      </div>
                    </form>
                  </div> */}
                </CardContent>
              </Card>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}