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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, Users, Calendar, GraduationCap, Clock, Award, ChevronLeft, ChevronRight, ArrowUpDown, Filter, Download, Search, Check } from "lucide-react";
import { studentService } from "@/lib/servies/studentService";
import { classService } from "@/lib/servies/classService";
import { attendanceService } from "@/lib/servies/attendanceService";
import { studentMarkService } from "@/lib/servies/studentMarkService";
import { assessmentService } from "@/lib/servies/assessmentService";
import { subjectService } from "@/lib/servies/subjectService";
import { StudentModel } from "@/models/Student";
import { ClassModel } from "@/models/Class";
import { AssessmentModel, AssessmentType } from "@/models/Assessment";
import { StudentMarkModel } from "@/models/StudentMark";
import { SubjectModel } from "@/models/subject";
import { StudentMarkExport } from "@/components/StudentMarkExport";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<ClassModel | null>(null);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [studentStatsMap, setStudentStatsMap] = useState<Record<string, any>>({});
  const [classAssessments, setClassAssessments] = useState<AssessmentModel[]>([]);
  const [classStudentMarks, setClassStudentMarks] = useState<StudentMarkModel[]>([]);
  const [subjects, setSubjects] = useState<SubjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [selectedAssessmentFilter, setSelectedAssessmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'assessment' | 'totalMarks'>('totalMarks');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [markedStudents, setMarkedStudents] = useState<Set<string>>(new Set());

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

        // Fetch assessments for this class
        const classAssessmentsData = await assessmentService.getByClass(classId);
        setClassAssessments(classAssessmentsData);

        // Fetch marks for this class
        const classMarksData = await studentMarkService.getMarksByClass(classId);
        setClassStudentMarks(classMarksData);

        // Fetch all subjects and filter to only those used in this class's assessments
        const allSubjects = await subjectService.getActive();
        const classSubjectIds = new Set(classAssessmentsData.map(a => a.subject_id).filter(Boolean) as string[]);
        const classSubjects = allSubjects.filter(subject => classSubjectIds.has(subject.id));
        setSubjects(classSubjects);

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
// Process students using the fetched stats
const processedStudents = useMemo(() => {
  return students.map(student => {
    // 1. ATTENDANCE LOGIC
    const stats = studentStatsMap[student.id] || { present: 0, absent: 0, late: 0, total: 0 };
    const presentPct = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
    
    // Parent Communication Logic
    const needsCommunication = (stats.absent >= 4) || (stats.late >= 10);
    let reason = "";
    if (stats.absent >= 4) reason = `Need Parent Comm. (Absents: ${stats.absent}/${stats.total})`;
    else if (stats.late >= 10) reason = `Need Parent Comm. (Lates: ${stats.late}/${stats.total})`;

    // 2. ASSESSMENT LOGIC
    const studentAssessmentData = classStudentMarks.filter(m => m.student_id === student.id);

    // Only count assessments that are graded and NOT excused
    const validMarks = studentAssessmentData.filter(m => m.score !== null && !m.is_excused);

    // Calculate accurate Total Points System average
    let totalAchievedScore = 0;
    let totalPossibleScore = 0;

    validMarks.forEach((m) => {
      const assessment = classAssessments.find(a => a.id === m.assessment_id);
      if (assessment && m.score !== null) {
        totalAchievedScore += m.score;
        totalPossibleScore += assessment.total_marks;
      }
    });

    const overallAssessmentAvg = totalPossibleScore > 0
      ? (totalAchievedScore / totalPossibleScore) * 100
      : 0;

    // Logic for specific assessment filter
    let specificAssessmentScore = null;
    let specificScoreActual = null;
    let specificTotalPossible = null;

    if (selectedAssessmentFilter !== 'all') {
      const specificMark = validMarks.find(m => m.assessment_id === selectedAssessmentFilter);
      const assessment = classAssessments.find(a => a.id === selectedAssessmentFilter);

      if (specificMark && assessment && specificMark.score !== null) {
        specificScoreActual = specificMark.score;
        specificTotalPossible = assessment.total_marks;
        specificAssessmentScore = (specificMark.score / assessment.total_marks) * 100;
      }
    }

    // Calculate total marks per subject
    const subjectTotals: Record<string, { totalAchieved: number; totalPossible: number }> = {};
    
    subjects.forEach(subject => {
      const subjectAssessments = classAssessments.filter(a => a.subject_id === subject.id);
      let subjectTotalAchieved = 0;
      let subjectTotalPossible = 0;

      subjectAssessments.forEach(assessment => {
        const mark = validMarks.find(m => m.assessment_id === assessment.id);
        if (mark && mark.score !== null) {
          subjectTotalAchieved += mark.score;
          subjectTotalPossible += assessment.total_marks;
        }
      });

      subjectTotals[subject.id] = {
        totalAchieved: subjectTotalAchieved,
        totalPossible: subjectTotalPossible
      };
    });

    return {
      ...student,
      stats: { ...stats, presentPct, needsCommunication, reason },
      assessmentData: {
        overallAverage: overallAssessmentAvg,
        totalAssessmentsTaken: validMarks.length,
        totalAchievedScore: totalAchievedScore,
        totalPossibleScore: totalPossibleScore, // Important for UI to show "45/50" instead of just "45"
        specificScore: specificAssessmentScore,
        specificScoreActual: specificScoreActual,
        specificTotalPossible: specificTotalPossible
      },
      subjectTotals
    };
  });
}, [students, studentStatsMap, classStudentMarks, classAssessments, selectedAssessmentFilter, subjects]);
  // Separate the lists
  const attentionRequired = processedStudents.filter(s => s.stats.needsCommunication);
  const goodStanding = processedStudents.filter(s => !s.stats.needsCommunication && s.stats.total > 0);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return processedStudents.filter(student => {
      const matchesSearch =
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parent_phone?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [processedStudents, searchTerm]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Sort students based on selected criteria
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.full_name.localeCompare(b.full_name)
          : b.full_name.localeCompare(a.full_name);
      }
      if (sortBy === 'attendance') {
        return sortOrder === 'asc'
          ? a.stats.presentPct - b.stats.presentPct
          : b.stats.presentPct - a.stats.presentPct;
      }
      if (sortBy === 'assessment') {
        const scoreA = selectedAssessmentFilter !== 'all' 
          ? (a.assessmentData.specificScore ?? -1)
          : a.assessmentData.overallAverage;
        const scoreB = selectedAssessmentFilter !== 'all' 
          ? (b.assessmentData.specificScore ?? -1)
          : b.assessmentData.overallAverage;
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      if (sortBy === 'totalMarks') {
        const totalA = a.assessmentData.totalAchievedScore ?? -1;
        const totalB = b.assessmentData.totalAchievedScore ?? -1;
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
      }
      return 0;
    });
    return sorted;
  }, [filteredStudents, sortBy, sortOrder, selectedAssessmentFilter]);

  // Calculate class assessment statistics
  const classAssessmentStats = useMemo(() => {
    const totalAssessments = classAssessments.length;
    const totalMarks = classStudentMarks.filter(m => m.score !== null && !m.is_excused);
    const averageScore = totalMarks.length > 0
      ? totalMarks.reduce((sum, m) => sum + (m.score || 0), 0) / totalMarks.length
      : 0;

    // Grade distribution
    const gradeDistribution = totalMarks.reduce((acc, mark) => {
      const assessment = classAssessments.find(a => a.id === mark.assessment_id);
      if (!assessment || mark.score === null) return acc;

      const percentage = (mark.score / assessment.total_marks) * 100;
      if (percentage >= 90) acc.A++;
      else if (percentage >= 80) acc.B++;
      else if (percentage >= 70) acc.C++;
      else if (percentage >= 60) acc.D++;
      else acc.F++;

      return acc;
    }, { A: 0, B: 0, C: 0, D: 0, F: 0 });

    return {
      totalAssessments,
      totalMarksRecorded: totalMarks.length,
      averageScore,
      gradeDistribution
    };
  }, [classAssessments, classStudentMarks]);

  // Helper functions
  const getAssessmentTypeLabel = (type: AssessmentType) => {
    const labels: Record<AssessmentType, string> = {
      exam: 'Exam',
      test: 'Test',
      assignment: 'Assignment',
      quiz: 'Quiz',
      project: 'Project'
    };
    return labels[type] || type;
  };

  const getGrade = (score: number, totalMarks: number) => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 90) return { label: 'A', color: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { label: 'B', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 70) return { label: 'C', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 60) return { label: 'D', color: 'bg-orange-100 text-orange-800' };
    return { label: 'F', color: 'bg-red-100 text-red-800' };
  };

  // Pagination for students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedStudents.slice(startIndex, endIndex);
  }, [sortedStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSortChange = (newSortBy: 'name' | 'attendance' | 'assessment' | 'totalMarks') => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleAssessmentFilterChange = (assessmentId: string) => {
    setSelectedAssessmentFilter(assessmentId);
    setCurrentPage(1);
  };

  const handleToggleMark = (studentId: string) => {
    const newMarked = new Set(markedStudents);
    if (newMarked.has(studentId)) {
      newMarked.delete(studentId);
    } else {
      newMarked.add(studentId);
    }
    setMarkedStudents(newMarked);
  };

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
    <>
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
          <div className="flex flex-col gap-4">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h1 className="font-h2 text-h2 text-on-surface">{classData.name}</h1>
                <p className="font-body-md mt-1 text-muted-foreground">
                  Schedule: {classData.schedule || 'Not set'}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <Button 
                  onClick={() => setIsExportModalOpen(true)} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Marks PDF
                </Button>
               
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
          </div>

          {/* Students Needing Attention */}
          {/* {attentionRequired.length > 0 && (
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
                      {attentionRequired.map((s, index) => (
                        <TableRow key={s.id} className={`hover:bg-red-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}`}>
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
          )} */}

          {/* Assessment Performance Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-primary" />
                Assessment Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-3xl font-bold text-primary">{classAssessmentStats.averageScore.toFixed(1)}%</p>
                  <p className="text-xs font-medium text-primary/80 mt-1">Class Average</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted border">
                  <p className="text-3xl font-bold">{classAssessmentStats.totalMarksRecorded}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Marks Recorded</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600">{classAssessmentStats.totalAssessments}</p>
                  <p className="text-xs font-medium text-blue-700 mt-1">Total Assessments</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-3xl font-bold text-green-600">{students.length}</p>
                  <p className="text-xs font-medium text-green-700 mt-1">Students</p>
                </div>
              </div>

              {/* Grade Distribution */}
              {/* <div>
                <h3 className="text-sm font-semibold mb-3">Grade Distribution</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['A', 'B', 'C', 'D', 'F'].map(grade => {
                    const count = classAssessmentStats.gradeDistribution[grade as keyof typeof classAssessmentStats.gradeDistribution];
                    const colors = {
                      A: 'bg-green-100 text-green-800 border-green-200',
                      B: 'bg-blue-100 text-blue-800 border-blue-200',
                      C: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      D: 'bg-orange-100 text-orange-800 border-orange-200',
                      F: 'bg-red-100 text-red-800 border-red-200'
                    };
                    return (
                      <div key={grade} className={`text-center p-3 rounded-lg border ${colors[grade as keyof typeof colors]}`}>
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs font-medium">Grade {grade}</p>
                      </div>
                    );
                  })}
                </div>
              </div> */}

              {/* Class Assessments Table */}
              {/* <div>
                <h3 className="text-sm font-semibold mb-3">Class Assessments</h3>
                <div className="border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total Marks</TableHead>
                        <TableHead>Students Graded</TableHead>
                        <TableHead>Average Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classAssessments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No assessments found for this class
                          </TableCell>
                        </TableRow>
                      ) : (
                        classAssessments.map((assessment) => {
                          const assessmentMarks = classStudentMarks.filter(m => m.assessment_id === assessment.id);
                          const gradedMarks = assessmentMarks.filter(m => m.score !== null && !m.is_excused);
                          const avgScore = gradedMarks.length > 0 
                            ? gradedMarks.reduce((sum, m) => sum + (m.score || 0), 0) / gradedMarks.length 
                            : 0;

                          return (
                            <TableRow key={assessment.id} className="hover:bg-muted/20">
                              <TableCell className="font-medium">{assessment.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{getAssessmentTypeLabel(assessment.type)}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {assessment.date || 'N/A'}
                              </TableCell>
                              <TableCell className="text-muted-foreground">{assessment.total_marks}</TableCell>
                              <TableCell className="text-muted-foreground">{gradedMarks.length}/{assessmentMarks.length}</TableCell>
                              <TableCell className="font-medium">{avgScore.toFixed(1)}%</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* All Students in Class */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">All Students</h2>
                  <p className="text-sm text-muted-foreground">Complete list of students in this class.</p>
                </div>
              </div>
              
              {/* Sort and Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    placeholder="Search by name or phone..."
                  />
                </div>

                {/* Assessment Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedAssessmentFilter} onValueChange={handleAssessmentFilterChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Assessments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assessments</SelectItem>
                      {classAssessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={assessment.id}>
                          {assessment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: any) => handleSortChange(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="assessment">{selectedAssessmentFilter !== 'all' ? 'Assessment Score' : 'Overall Avg'}</SelectItem>
                      <SelectItem value="totalMarks">Total Marks</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-blue-50">
                    <TableRow>
                      <TableHead className="font-bold text-blue-900 text-center w-12">Mark</TableHead>
                      <TableHead className="font-bold text-blue-900 text-center w-16">Rank</TableHead>
                      <TableHead className="font-bold text-blue-900">Student</TableHead>
                      <TableHead className="text-center">Total Records</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Attendance Rate</TableHead>
                      {subjects.map(subject => (
                        <TableHead key={subject.id} className="text-center">
                          {subject.name}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Assessment Score</TableHead>
                      <TableHead className="text-center">Cumulative Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.length > 0 ? (
                      paginatedStudents.map((s, index) => (
                        <TableRow key={s.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-200'} ${markedStudents.has(s.id) ? 'bg-yellow-100 border-l-4 border-yellow-500' : ''}`}>
                          <TableCell className="text-center">
                            <button
                              onClick={() => handleToggleMark(s.id)}
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                markedStudents.has(s.id)
                                  ? 'bg-yellow-500 border-yellow-500 text-white'
                                  : 'border-gray-300 hover:border-yellow-500'
                              }`}
                            >
                              {markedStudents.has(s.id) && <Check className="h-4 w-4" />}
                            </button>
                          </TableCell>
                          <TableCell className="text-center font-bold text-primary">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
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
                          {/* Subject Totals */}
                          {subjects.map(subject => {
                            const subjectData = s.subjectTotals[subject.id];
                            return (
                              <TableCell key={subject.id} className="text-center">
                                <span className="font-semibold text-sm">
                                  {subjectData?.totalPossible > 0 
                                    ? `${subjectData.totalAchieved}/${subjectData.totalPossible}`
                                    : 'N/A'
                                  }
                                </span>
                              </TableCell>
                            );
                          })}
                          {/* Overall Average */}
                          <TableCell className="text-center">
                            <span className="font-semibold">
                              {selectedAssessmentFilter !== 'all' 
                                ? (s.assessmentData.specificScoreActual !== null 
                                    ? `${s.assessmentData.specificScoreActual} / ${s.assessmentData.specificTotalPossible}` 
                                    : 'N/A')
                                : (s.assessmentData.totalAssessmentsTaken > 0 
                                    ? `${s.assessmentData.overallAverage.toFixed(1)}%` 
                                    : 'N/A')
                              }
                            </span>
                          </TableCell>
                          {/* Cumulative Marks Context */}
                          <TableCell className="text-center">
                            <span className="font-semibold text-muted-foreground">
                              {s.assessmentData.totalAssessmentsTaken > 0 
                                ? `${s.assessmentData.totalAchievedScore} / ${s.assessmentData.totalPossibleScore}` 
                                : 'N/A'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11 + subjects.length} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? 'No students found matching your search.' : 'No students found in this class.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of {sortedStudents.length} students
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>

    {/* Student Mark Export Modal */}
    {classData && (
      <StudentMarkExport 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)}
        classId={classId}
        className={classData.name}
      />
    )}
    </>
  );
}
