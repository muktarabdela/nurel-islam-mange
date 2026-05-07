"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, CheckCircle, X, Clock, RefreshCw } from "lucide-react";
import { useData } from "@/context/dataContext";
import { attendanceService } from "@/lib/servies/attendanceService";
import { AttendanceModel } from "@/models/Attendance";
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker";
import { EthiopianDateComponents, formatEthiopianDate } from "@/lib/utils/ethiopian-date";

export default function AttendancePage() {
  const { students, classes, loading, error } = useData();
  const [attendance, setAttendance] = useState<AttendanceModel[]>([]);
  const [selectedEthiopianDate, setSelectedEthiopianDate] = useState<string>('');
  const [selectedEthiopianComponents, setSelectedEthiopianComponents] = useState<EthiopianDateComponents | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);

  const fetchAttendance = async () => {
    if (!selectedEthiopianComponents) return;
    
    try {
      setAttendanceLoading(true);
      // Convert Ethiopian date to Gregorian for API compatibility
      const gregorianDate = selectedEthiopianComponents.ethiopian_date;
      
      const data = await attendanceService.getByDate(
        gregorianDate,
        selectedClass === 'all' ? undefined : selectedClass
      );
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    // Set initial Ethiopian date on mount
    import('@/lib/utils/ethiopian-date').then(({ getCurrentEthiopianDate }) => {
      const currentEthiopian = getCurrentEthiopianDate();
      setSelectedEthiopianDate(currentEthiopian.ethiopian_date);
      setSelectedEthiopianComponents(currentEthiopian);
    });
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedEthiopianComponents, selectedClass]);

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.full_name : 'Unknown Student';
  };

  const getStudentId = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.id : 'Unknown ID';
  };

  const getClassName = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading attendance data...</div>
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
          <main className="flex-1 p-8">
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

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden relative">
        
        <TopNavBar />

        {/* Page Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-12">
          
          {/* Page Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-h1 text-h1 text-on-background mb-2">Attendance Records</h2>
              <p className="font-body-md text-body-md">
                View and filter student attendance records.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Ethiopian Date Picker */}
              <div className="flex flex-col gap-2 flex-1 sm:min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="ethiopian-date">
                  Ethiopian Date
                </label>
                <EthiopianDatePicker
                  id="ethiopian-date"
                  value={selectedEthiopianDate}
                  onChange={(date, components) => {
                    setSelectedEthiopianDate(date);
                    setSelectedEthiopianComponents(components);
                  }}
                  placeholder="Select Ethiopian date"
                />
              </div>
              
              {/* Class Selector */}
              <div className="flex flex-col gap-2 flex-1 sm:min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="class-select">
                  Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground invisible">Refresh</label>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={fetchAttendance}
                  disabled={attendanceLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${attendanceLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Attendance Records Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Attendance Records ({attendance.length})</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">Late</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {attendanceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Loading attendance records...</div>
                </div>
              ) : attendance.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Student Name</TableHead>
                      <TableHead className="w-[20%]">Class</TableHead>
                      <TableHead className="w-[15%]">Ethiopian Date</TableHead>
                      <TableHead className="w-[15%]">Time</TableHead>
                      <TableHead className="text-right w-[20%]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => {
                      const studentName = getStudentName(record.student_id);
                      const studentId = getStudentId(record.student_id);
                      const className = getClassName(record.class_id);
                      const initials = getInitials(studentName);
                      const time = new Date(record.created_at).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      });
                      
                      // Format Ethiopian date for display
                      const ethiopianDateDisplay = formatEthiopianDate({
                        ethiopian_day: record.ethiopian_day,
                        ethiopian_month: record.ethiopian_month,
                        ethiopian_year: record.ethiopian_year,
                        ethiopian_date: record.ethiopian_date
                      });
                      
                      return (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {initials}
                              </div>
                              <span className="font-medium">{studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{className}</TableCell>
                          <TableCell className="text-muted-foreground">{ethiopianDateDisplay}</TableCell>
                          <TableCell className="text-muted-foreground">{time}</TableCell>
                          <TableCell className="text-right">
                            {getStatusBadge(record.status)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-2">No attendance records found</div>
                    <div className="text-sm text-muted-foreground">
                      Try selecting a different date or class
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </main>
      </div>
    </div>
  );
}