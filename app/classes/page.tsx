"use client";

import { useState, useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import ClassModal from "@/components/ClassModal";
import ClassUstazModal from "@/components/ClassUstazModal";
import { useData } from '@/context/dataContext';
import { ClassModel } from '@/models/Class';
import { classService } from '@/lib/servies/classService';
import { classUstazService } from '@/lib/servies/classUstazService';
import { studentService } from '@/lib/servies/studentService';
import { UstazModel } from '@/models/Ustaz';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, UserPlus, Calendar, Edit, Trash2, MoreVertical, ChevronLeft, ChevronRight, GraduationCap, Clock } from "lucide-react";

interface ClassWithUstaz extends ClassModel {
  assignedUstaz: UstazModel[];
  studentCount?: number;
}

export default function ClassesPage() {
  const { classes, ustaz, loading, error, refreshData } = useData();
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isUstazModalOpen, setIsUstazModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(null);
  const [classesWithUstaz, setClassesWithUstaz] = useState<ClassWithUstaz[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClassesWithUstaz();
  }, [classes]);

  const fetchClassesWithUstaz = async () => {
    const classesData: ClassWithUstaz[] = await Promise.all(
      classes.map(async (classItem) => {
        try {
          const ustazAssignments = await classUstazService.getByClass(classItem.id);
          const assignedUstaz = ustazAssignments.map(assignment => assignment.ustaz).filter(Boolean);
          const students = await studentService.getByClass(classItem.id);
          
          return {
            ...classItem,
            assignedUstaz,
            studentCount: students.length
          };
        } catch (err) {
          console.error('Error fetching ustaz for class:', classItem.id, err);
          return {
            ...classItem,
            assignedUstaz: [],
            studentCount: 0
          };
        }
      })
    );
    setClassesWithUstaz(classesData);
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsClassModalOpen(true);
  };

  const handleEditClass = (classItem: ClassModel) => {
    setSelectedClass(classItem);
    setIsClassModalOpen(true);
  };

  const handleAssignUstaz = (classItem: ClassModel) => {
    setSelectedClass(classItem);
    setIsUstazModalOpen(true);
  };

  const handleDeleteClass = async (classItem: ClassModel) => {
    try {
      await classService.delete(classItem.id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  };

  const handleClassModalSuccess = () => {
    refreshData();
  };

  const handleUstazModalSuccess = () => {
    fetchClassesWithUstaz();
  };

  const paginatedClasses = classesWithUstaz.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(classesWithUstaz.length / itemsPerPage);

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

  if (error) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNavBar />

        {/* Page Content */}
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 overflow-y-auto">
          
          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-h2 text-h2 text-on-surface">Classes Overview</h1>
              <p className="font-body-md mt-1">
                Manage your institution's classes, students, and assigned Ustaz.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleAddClass} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Add Class
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Assigned Ustaz</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No classes found. Click "Add Class" to create your first class.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedClasses.map((classItem) => (
                      <TableRow key={classItem.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-semibold">{classItem.name}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {classItem.schedule || 'Not set'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {classItem.studentCount || 0} Students
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {classItem.assignedUstaz.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {classItem.assignedUstaz[0].full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span className="text-sm">
                                {classItem.assignedUstaz[0].full_name}
                                {classItem.assignedUstaz.length > 1 && ` +${classItem.assignedUstaz.length - 1}`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No ustaz assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="relative inline-block">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditClass(classItem)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Class
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignUstaz(classItem)}>
                                  <GraduationCap className="h-4 w-4 mr-2" />
                                  Assign Ustaz
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Class
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete "{classItem.name}" and all associated data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteClass(classItem)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, classesWithUstaz.length)} of {classesWithUstaz.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* Modals */}
      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        class={selectedClass}
        onSuccess={handleClassModalSuccess}
      />

      <ClassUstazModal
        isOpen={isUstazModalOpen}
        onClose={() => setIsUstazModalOpen(false)}
        class={selectedClass}
        onSuccess={handleUstazModalSuccess}
      />
    </div>
  );
}