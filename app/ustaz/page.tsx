"use client";

import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import UstazModal from "@/components/UstazModal";
import { useData } from "@/context/dataContext";
import { UstazModel } from "@/models/Ustaz";
import { ustazService } from "@/lib/servies/ustazService";
import { classUstazService } from "@/lib/servies/classUstazService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserPlus, Filter, Search, Edit, Trash2, ChevronLeft, ChevronRight, GraduationCap, Calendar, Building } from "lucide-react";

export default function UstazPage() {
  const { ustaz: ustazData, loading, error, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUstaz, setSelectedUstaz] = useState<UstazModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<Record<string, string[]>>({});

  // Fetch assigned classes for all ustaz
  const fetchAssignedClasses = async () => {
    try {
      const classesMap: Record<string, string[]> = {};
      
      for (const ustaz of ustazData) {
        const classAssignments = await classUstazService.getByUstaz(ustaz.id);
        const classNames = classAssignments
          .map((assignment: any) => assignment.classes?.name)
          .filter(Boolean);
        classesMap[ustaz.id] = classNames;
      }
      
      setAssignedClasses(classesMap);
    } catch (err) {
      console.error('Error fetching assigned classes:', err);
    }
  };

  useEffect(() => {
    if (ustazData.length > 0) {
      fetchAssignedClasses();
    }
  }, [ustazData]);

  const filteredUstaz = ustazData.filter(ustaz => 
    ustaz.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ustaz.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ustaz.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUstazCount = ustazData.filter(u => u.is_active).length;
  const inactiveUstazCount = ustazData.filter(u => !u.is_active).length;

  const handleAddUstaz = () => {
    setSelectedUstaz(null);
    setIsModalOpen(true);
  };

  const handleEditUstaz = (ustaz: UstazModel) => {
    setSelectedUstaz(ustaz);
    setIsModalOpen(true);
  };

  const handleDeleteUstaz = async (ustaz: UstazModel) => {
    if (!confirm(`Are you sure you want to delete ${ustaz.full_name}?`)) return;
    
    setDeleteLoading(ustaz.id);
    try {
      await ustazService.delete(ustaz.id);
      await refreshData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete ustaz');
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

  return (
    <>
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        
        <Sidebar />

<div className="md:ml-[280px] flex-1 flex flex-col min-h-screen">          
          <TopNavBar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 bg-background">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
              
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="font-h1 text-h1 text-on-background mb-2">Ustaz Management</h1>
                  <p className="font-body-md text-on-surface-variant">
                    Manage teaching staff, assignments, and status.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button onClick={handleAddUstaz} className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Ustaz
                  </Button>
                </div>
              </div>

              {/* Bento Data Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 - Total Ustaz */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Ustaz
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ustazData.length}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Users className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-green-600">{activeUstazCount} active</span>
                    </p>
                  </CardContent>
                </Card>

                {/* Card 2 - Active Classes */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Classes
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeUstazCount}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently teaching
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Data Table */}
              <Card>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Ustaz Directory</CardTitle>
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      placeholder="Search by name or phone..."
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            Loading ustaz data...
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-destructive">
                            Error: {error}
                          </TableCell>
                        </TableRow>
                      ) : filteredUstaz.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            {searchTerm ? 'No ustaz found matching your search.' : 'No ustaz found.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUstaz.map((ustaz) => (
                          <TableRow key={ustaz.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                  ustaz.is_active 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {getInitials(ustaz.full_name)}
                                </div>
                                <div>
                                  <div className="font-medium">{ustaz.full_name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {ustaz.is_active ? 'Teaching Staff' : 'Inactive'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {ustaz.phone_number || <span className="text-xs">No contact info</span>}
                              {ustaz.phone_number && <div className="text-xs"></div>}
                            </TableCell>
                            <TableCell>
                              {assignedClasses[ustaz.id]?.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {assignedClasses[ustaz.id].map((className, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {className}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No classes assigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={ustaz.is_active ? "default" : "secondary"} className={`${
                                ustaz.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                              }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  ustaz.is_active ? 'bg-green-500' : 'bg-gray-400'
                                }`}></span>
                                {ustaz.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditUstaz(ustaz)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      disabled={deleteLoading === ustaz.id}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete {ustaz.full_name}'s record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUstaz(ustaz)}
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
                      Showing {filteredUstaz.length} of {ustazData.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
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

      {/* Ustaz Modal */}
      
      <UstazModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ustaz={selectedUstaz}
        onSuccess={handleModalSuccess}
      />
      
      </>
  );
}
