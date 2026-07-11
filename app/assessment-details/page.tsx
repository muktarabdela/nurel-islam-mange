"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/dataContext';
import { AssessmentModel, AssessmentType } from '@/models/Assessment';
import { StudentMarkModel } from '@/models/StudentMark';
import { StudentModel } from '@/models/Student';
import { ClassModel } from '@/models/Class';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Filter, Download, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface StudentAssessmentSummary {
  student: StudentModel;
  totalAssessments: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  marks: StudentMarkModel[];
}

export default function AssessmentDetailsPage() {
  const router = useRouter();
  const { 
    classes, 
    assessments, 
    studentMarks, 
    students, 
    loading, 
    error: dataError 
  } = useData();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Redirect if not authenticated
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    router.push('/login');
  }

  // Filter assessments based on selected filters
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      if (selectedClass !== 'all' && assessment.class_id !== selectedClass) return false;
      if (selectedAssessmentType !== 'all' && assessment.type !== selectedAssessmentType) return false;
      if (selectedAssessment !== 'all' && assessment.id !== selectedAssessment) return false;
      return true;
    });
  }, [assessments, selectedClass, selectedAssessmentType, selectedAssessment]);

  // Filter students based on selected class
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter(student => student.class_id === selectedClass);
  }, [students, selectedClass]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedStudent, selectedAssessmentType, selectedAssessment, searchQuery]);

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

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls?.name || 'Unknown Class';
  };

  const getGrade = (score: number, totalMarks: number) => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 90) return { label: 'A', color: 'bg-green-100 text-green-800' };
    if (percentage >= 80) return { label: 'B', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 70) return { label: 'C', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 60) return { label: 'D', color: 'bg-orange-100 text-orange-800' };
    return { label: 'F', color: 'bg-red-100 text-red-800' };
  };

  const getPerformanceTrend = (student: StudentAssessmentSummary) => {
    if (student.marks.length < 2) return null;
    
    const sortedMarks = [...student.marks].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const recent = sortedMarks[sortedMarks.length - 1]?.score || 0;
    const previous = sortedMarks[sortedMarks.length - 2]?.score || 0;
    
    if (recent > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (recent < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  // Calculate student assessment summaries
  const studentSummaries = useMemo(() => {
    const summaries: StudentAssessmentSummary[] = filteredStudents.map(student => {
      const studentMarksForAssessments = studentMarks.filter(mark => {
        if (mark.student_id !== student.id) return false;
        if (selectedAssessment !== 'all' && mark.assessment_id !== selectedAssessment) return false;
        
        const assessment = assessments.find(a => a.id === mark.assessment_id);
        if (!assessment) return false;
        
        if (selectedClass !== 'all' && assessment.class_id !== selectedClass) return false;
        if (selectedAssessmentType !== 'all' && assessment.type !== selectedAssessmentType) return false;
        
        return true;
      });

      const validMarks = studentMarksForAssessments.filter(mark => mark.score !== null && !mark.is_excused);
      const totalScore = validMarks.reduce((sum, mark) => sum + (mark.score || 0), 0);
      const averageScore = validMarks.length > 0 ? totalScore / validMarks.length : 0;
      const highestScore = validMarks.length > 0 ? Math.max(...validMarks.map(m => m.score || 0)) : 0;
      const lowestScore = validMarks.length > 0 ? Math.min(...validMarks.map(m => m.score || 0)) : 0;

      return {
        student,
        totalAssessments: studentMarksForAssessments.length,
        totalScore,
        averageScore,
        highestScore,
        lowestScore,
        marks: studentMarksForAssessments
      };
    });

    // Filter by search query
    const filteredBySearch = summaries.filter(summary => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        summary.student.full_name.toLowerCase().includes(query) ||
        getClassName(summary.student.class_id || '').toLowerCase().includes(query)
      );
    });

    // Sort by average score descending
    return filteredBySearch.sort((a, b) => b.averageScore - a.averageScore);
  }, [filteredStudents, studentMarks, assessments, selectedClass, selectedAssessmentType, selectedAssessment, searchQuery, classes]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalStudents = studentSummaries.length;
    const studentsWithMarks = studentSummaries.filter(s => s.totalAssessments > 0);
    const classAverage = studentsWithMarks.length > 0 
      ? studentsWithMarks.reduce((sum, s) => sum + s.averageScore, 0) / studentsWithMarks.length 
      : 0;
    const highestAverage = studentsWithMarks.length > 0 
      ? Math.max(...studentsWithMarks.map(s => s.averageScore)) 
      : 0;
    const lowestAverage = studentsWithMarks.length > 0 
      ? Math.min(...studentsWithMarks.map(s => s.averageScore)) 
      : 0;

    return {
      totalStudents,
      studentsWithMarks: studentsWithMarks.length,
      classAverage,
      highestAverage,
      lowestAverage
    };
  }, [studentSummaries]);

  // Pagination logic
  const paginatedStudentSummaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return studentSummaries.slice(startIndex, endIndex);
  }, [studentSummaries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(studentSummaries.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const resetFilters = () => {
    setSelectedClass('all');
    setSelectedStudent('all');
    setSelectedAssessmentType('all');
    setSelectedAssessment('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading assessment details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-600">Error: {dataError}</div>
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
        <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Assessment Details</h1>
              <p className="text-muted-foreground mt-1">View detailed student assessment results and performance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filter Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search students by name or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Student</label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Students" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      {filteredStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assessment Type</label>
                  <Select value={selectedAssessmentType} onValueChange={setSelectedAssessmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Specific Assessment</label>
                  <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Assessments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assessments</SelectItem>
                      {filteredAssessments.map((assessment) => (
                        <SelectItem key={assessment.id} value={assessment.id}>
                          {assessment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Students with Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.studentsWithMarks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.classAverage.toFixed(1)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Performance Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overallStats.lowestAverage.toFixed(1)}% - {overallStats.highestAverage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Assessment Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Assessment Results</CardTitle>
            </CardHeader>
            <CardContent>
              {studentSummaries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assessment data available for the selected filters.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Assessments</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>Highest</TableHead>
                          <TableHead>Lowest</TableHead>
                          <TableHead>Trend</TableHead>
                          <TableHead>Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedStudentSummaries.map((summary) => {
                          const filteredByStudent = selectedStudent === 'all' || selectedStudent === summary.student.id;
                          if (!filteredByStudent) return null;

                          const grade = getGrade(summary.averageScore, 100);
                          
                          return (
                            <TableRow key={summary.student.id}>
                              <TableCell className="font-medium">{summary.student.full_name}</TableCell>
                              <TableCell>{getClassName(summary.student.class_id || '')}</TableCell>
                              <TableCell>{summary.totalAssessments}</TableCell>
                              <TableCell>{summary.averageScore.toFixed(1)}%</TableCell>
                              <TableCell>{summary.highestScore.toFixed(1)}</TableCell>
                              <TableCell>{summary.lowestScore.toFixed(1)}</TableCell>
                              <TableCell>{getPerformanceTrend(summary)}</TableCell>
                              <TableCell>
                                <Badge className={grade.color}>{grade.label}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, studentSummaries.length)} of {studentSummaries.length} students
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
                            // Show first, last, current, and adjacent pages
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Detailed Assessment Breakdown */}
          {selectedStudent !== 'all' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Detailed Assessment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const studentSummary = studentSummaries.find(s => s.student.id === selectedStudent);
                  if (!studentSummary || studentSummary.marks.length === 0) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        No detailed assessment data available for this student.
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Assessment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Total Marks</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentSummary.marks.map((mark) => {
                            const assessment = assessments.find(a => a.id === mark.assessment_id);
                            if (!assessment) return null;

                            const percentage = mark.score !== null 
                              ? ((mark.score / assessment.total_marks) * 100).toFixed(1) 
                              : 'N/A';
                            const grade = mark.score !== null 
                              ? getGrade(mark.score, assessment.total_marks) 
                              : { label: 'N/A', color: 'bg-gray-100 text-gray-800' };

                            return (
                              <TableRow key={mark.id}>
                                <TableCell className="font-medium">{assessment.title}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{getAssessmentTypeLabel(assessment.type)}</Badge>
                                </TableCell>
                                <TableCell>{assessment.date || 'N/A'}</TableCell>
                                <TableCell>{mark.score ?? 'N/A'}</TableCell>
                                <TableCell>{assessment.total_marks}</TableCell>
                                <TableCell>{percentage}%</TableCell>
                                <TableCell>
                                  <Badge className={grade.color}>{grade.label}</Badge>
                                </TableCell>
                                <TableCell>
                                  {mark.is_excused ? (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                                      Excused
                                    </Badge>
                                  ) : mark.score === null ? (
                                    <Badge variant="outline" className="bg-gray-50 text-gray-800">
                                      Not Graded
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{mark.remarks || '-'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
