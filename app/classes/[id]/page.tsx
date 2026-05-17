"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, Users, Calendar, GraduationCap, Clock } from "lucide-react";
import { studentService } from "@/lib/servies/studentService";
import { classService } from "@/lib/servies/classService";
import { attendanceService } from "@/lib/servies/attendanceService";
import { StudentModel } from "@/models/Student";
import { ClassModel } from "@/models/Class";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassModel | null>(null);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [studentStatsMap, setStudentStatsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Fetch class details
        const classDetails = await classService.getById(classId);
        if (!classDetails) {
          setError("Class not found");
          return;
        }
        setClassData(classDetails);

        // Fetch students in this class
        const classStudents = await studentService.getByClass(classId);
        setStudents(classStudents);

        // Fetch attendance stats for students in this class
        const stats = await attendanceService.getStudentStatsByClass(classId);
        setStudentStatsMap(stats);

      } catch (err) {
        console.error("Failed to load class data:", err);
        setError("Failed to load class data");
      } finally {
        setLoading(false);
      }
    }

    if (classId) {
      loadData();
    }
  }, [classId]);

  // Process students using the fetched stats
  const processedStudents = useMemo(() => {
    return students.map(student => {
      const stats = studentStatsMap[student.id] || { present: 0, absent: 0, late: 0, total: 0 };
      
      const presentPct = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
      
      // LOGIC: 4 absent in last 20 OR 10 late in last 20
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

  // Separate the lists
  const attentionRequired = processedStudents.filter(s => s.stats.needsCommunication);
  const goodStanding = processedStudents.filter(s => !s.stats.needsCommunication && s.stats.total > 0);

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex items-center justify-center">
          <div className="text-red-600">{error || "Class not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNavBar />

        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 overflow-y-auto">
          
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </div>

          {/* Class Info Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-h2 text-h2 text-on-surface">{classData.name}</h1>
              <p className="font-body-md mt-1 text-muted-foreground">
                Schedule: {classData.schedule || 'Not set'}
              </p>
            </div>
            <div className="flex gap-4">
              <Card className="min-w-[150px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              <Card className="min-w-[150px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Need Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{attentionRequired.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Students Needing Attention */}
          {attentionRequired.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
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
                        <TableHead className="text-center">Absents (Last 20)</TableHead>
                        <TableHead className="text-center">Lates (Last 20)</TableHead>
                        <TableHead className="text-red-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attentionRequired.map((s) => (
                        <TableRow key={s.id} className="hover:bg-red-50/50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/students/${s.id}`} className="hover:text-primary hover:underline cursor-pointer">
                                {s.full_name}
                              </Link>
                              <span className="text-sm text-muted-foreground">{s.parent_phone}</span>
                            </div>
                          </TableCell>
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
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Students in Class */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">All Students</h2>
                <p className="text-sm text-muted-foreground">Complete list of students in this class.</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-blue-50">
                    <TableRow>
                      <TableHead className="font-bold text-blue-900">Student</TableHead>
                      <TableHead className="text-center">Total Records</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedStudents.length > 0 ? (
                      processedStudents.map((s) => (
                        <TableRow key={s.id} className="hover:bg-blue-50/50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/students/${s.id}`} className="hover:text-primary hover:underline cursor-pointer">
                                {s.full_name}
                              </Link>
                              <span className="text-sm text-muted-foreground">{s.parent_phone}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{s.stats.total}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {s.stats.present}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={s.stats.absent >= 4 ? "destructive" : "secondary"} className={s.stats.absent >= 4 ? "" : "bg-red-100 text-red-700"}>
                              {s.stats.absent}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={s.stats.late >= 10 ? "destructive" : "secondary"} className={s.stats.late >= 10 ? "" : "bg-orange-100 text-orange-700"}>
                              {s.stats.late}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">{s.stats.presentPct.toFixed(1)}%</span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No students found in this class.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
}
