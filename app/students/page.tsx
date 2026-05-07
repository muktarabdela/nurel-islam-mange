"use client";

import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import StudentModal from "@/components/StudentModal";
import { useData } from "@/context/dataContext";
import { StudentModel } from "@/models/Student";
import { studentService } from "@/lib/servies/studentService";
import { classUstazService } from "@/lib/servies/classUstazService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserPlus, Filter, Search, Edit, Trash2, ChevronLeft, ChevronRight, Users2, GraduationCap, UserX, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentsPage() {
  const { students: studentsData, classes, ustaz, loading, error, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedUstaz, setSelectedUstaz] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [classUstazAssignments, setClassUstazAssignments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch class-ustaz assignments
  useEffect(() => {
    const fetchClassUstazAssignments = async () => {
      try {
        const assignments = await classUstazService.getAll();
        setClassUstazAssignments(assignments);
      } catch (err) {
        console.error('Error fetching class-ustaz assignments:', err);
      }
    };
    fetchClassUstazAssignments();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedUstaz]);

  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = 
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class_id === selectedClass;
    
    // For ustaz filter, check if the student's class has the selected ustaz assigned
    let matchesUstaz = selectedUstaz === 'all';
    if (selectedUstaz !== 'all' && student.class_id) {
      const classAssignment = classUstazAssignments.find(
        assignment => assignment.class_id === student.class_id && assignment.ustaz_id === selectedUstaz
      );
      matchesUstaz = !!classAssignment;
    }
    
    return matchesSearch && matchesClass && matchesUstaz;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const activeStudentsCount = studentsData.filter(s => s.is_active).length;
  const inactiveStudentsCount = studentsData.filter(s => !s.is_active).length;

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: StudentModel) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (student: StudentModel) => {
    if (!confirm(`Are you sure you want to delete ${student.full_name}?`)) return;
    
    setDeleteLoading(student.id);
    try {
      await studentService.delete(student.id);
      await refreshData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleModalSuccess = () => {
    refreshData();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getClassName = (classId: string | null) => {
    if (!classId) return 'Unassigned';
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  return (
    <>
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        
        <Sidebar />

        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          
          <TopNavBar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 bg-background">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
              
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="font-h1 text-h1 text-on-background mb-2">Students Management</h1>
                  <p className="font-body-md text-on-surface-variant">
                    Manage enrollments, assign classes, and monitor student status.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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

                  {/* Ustaz Selector */}
                  <div className="flex flex-col gap-2 flex-1 sm:min-w-[200px]">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="ustaz-select">
                      Ustaz
                    </label>
                    <Select value={selectedUstaz} onValueChange={setSelectedUstaz}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ustaz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ustaz</SelectItem>
                        {ustaz.map((ustazItem) => (
                          <SelectItem key={ustazItem.id} value={ustazItem.id}>
                            {ustazItem.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add Student Button */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-muted-foreground invisible">Add</label>
                    <Button onClick={handleAddStudent} className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bento Data Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 - Total Students */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Students
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{studentsData.length}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Users2 className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">{activeStudentsCount} active</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Card 2 - Class Assignments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Class Assignments
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeStudentsCount}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently enrolled
                    </p>
                  </CardContent>
                </Card>

                {/* Card 3 - Inactive Students */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Inactive Students
                    </CardTitle>
                    <UserX className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inactiveStudentsCount}</div>
                    <p className="text-xs text-red-600 mt-2">
                      Not active
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Data Table */}
              <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Student Directory</CardTitle>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      placeholder="Search by name, phone, or class..."
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Parent Phone</TableHead>
                        <TableHead>Class Assignment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            Loading student data...
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-destructive">
                            Error: {error}
                          </TableCell>
                        </TableRow>
                      ) : paginatedStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            {searchTerm ? 'No students found matching your search.' : 'No students found.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedStudents.map((student, index) => (
                          <TableRow key={student.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                  student.is_active 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {startIndex + index + 1}
                                </div>
                                <div>
                                  <div className="font-medium">{student.full_name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {student.parent_phone || <span className="text-xs">No phone info</span>}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {getClassName(student.class_id)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.is_active ? "default" : "secondary"} className={`${
                                student.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                              }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  student.is_active ? 'bg-green-500' : 'bg-gray-400'
                                }`}></span>
                                {student.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditStudent(student)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      disabled={deleteLoading === student.id}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete {student.full_name}'s record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteStudent(student)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
