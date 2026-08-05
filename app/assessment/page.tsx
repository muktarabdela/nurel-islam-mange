"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/dataContext';
import { assessmentService } from '@/lib/servies/assessmentService';
import { AssessmentModel, AssessmentType } from '@/models/Assessment';
import { ClassModel } from '@/models/Class';
import { isAuthenticated, getUstazFromSession, isAdmin } from '@/lib/auth';
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AssessmentPage() {
  const router = useRouter();
  const { classes, assessments, refreshData, loading, error: dataError, ustaz } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentModel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentModel[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Filter assessments based on user role
  useEffect(() => {
    if (isAdmin()) {
      // Admins see all assessments
      setFilteredAssessments(assessments);
    } else {
      const currentUstaz = getUstazFromSession();
      if (currentUstaz) {
        // Ustaz sees assessments assigned to them OR those with no specific ustaz (null)
        setFilteredAssessments(
          assessments.filter(
            (assessment) => 
              assessment.ustaz_id === currentUstaz.id || 
              assessment.ustaz_id === null
          )
        );
      } else {
        // If no ustaz session, show nothing
        setFilteredAssessments([]);
      }
    }
  }, [assessments]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'exam' as AssessmentType,
    total_marks: '',
    class_id: '',
    description: '',
    date: '',
    ethiopian_date: '',
    ustaz_id: ''
  });

  const isEditing = !!editingAssessment;

  useEffect(() => {
    if (editingAssessment) {
      setFormData({
        title: editingAssessment.title,
        type: editingAssessment.type,
        total_marks: editingAssessment.total_marks.toString(),
        class_id: editingAssessment.class_id,
        description: editingAssessment.description || '',
        date: editingAssessment.date || '',
        ethiopian_date: editingAssessment.ethiopian_date || '',
        ustaz_id: editingAssessment.ustaz_id || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'exam',
        total_marks: '',
        class_id: '',
        description: '',
        date: '',
        ethiopian_date: '',
        ustaz_id: ''
      });
    }
    setError('');
  }, [editingAssessment, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Assessment title is required');
      }
      if (!formData.class_id) {
        throw new Error('Class selection is required');
      }
      if (!formData.total_marks || isNaN(Number(formData.total_marks)) || Number(formData.total_marks) <= 0) {
        throw new Error('Total marks must be a positive number');
      }

      if (isEditing && editingAssessment) {
        // Update existing assessment
        const updateData = {
          title: formData.title.trim(),
          type: formData.type,
          total_marks: Number(formData.total_marks),
          class_id: formData.class_id,
          description: formData.description.trim() || null,
          date: formData.date || null,
          ethiopian_date: formData.ethiopian_date.trim() || null,
          ustaz_id: formData.ustaz_id || null
        };

        await assessmentService.update(editingAssessment.id, updateData);
        setSuccess('Assessment updated successfully!');
      } else {
        // Create new assessment
        const submitData = {
          title: formData.title.trim(),
          type: formData.type,
          total_marks: Number(formData.total_marks),
          class_id: formData.class_id,
          description: formData.description.trim() || null,
          date: formData.date || null,
          ethiopian_date: formData.ethiopian_date.trim() || null,
          created_by: '00000000-0000-0000-0000-000000000000', // Placeholder UUID until auth is implemented
          is_published: false,
          ustaz_id: formData.ustaz_id || null
        };

        await assessmentService.create(submitData);
        setSuccess('Assessment created successfully!');
      }

      setFormData(prevFormData => ({
        ...prevFormData,
        title: '',
        type: 'exam',
        total_marks: '',
        class_id: '',
        description: '',
        date: '',
        ethiopian_date: '',
        ustaz_id: ''
      }));
      setEditingAssessment(null);
      setIsModalOpen(false);
      
      // Refresh data to show changes
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (assessment: AssessmentModel) => {
    try {
      if (assessment.is_published) {
        await assessmentService.unpublish(assessment.id);
      } else {
        await assessmentService.togglePublish(assessment.id);
      }
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle publish status');
    }
  };

  const handleEdit = (assessment: AssessmentModel) => {
    setEditingAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    
    try {
      await assessmentService.delete(id);
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const getUstazName = (ustazId: string | null) => {
    if (!ustazId) return 'All Ustazs';
    const u = ustaz.find(u => u.id === ustazId);
    return u?.full_name || 'Unknown Ustaz';
  };

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-4 md:p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading assessment data...</div>
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
          <main className="flex-1 p-4 md:p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
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
        <main className="flex-1 p-4 md:p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Assessment Management</h1>
              <p className="text-muted-foreground mt-1">Create and manage student assessments</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              + Create Assessment
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 mb-4">
              {success}
            </div>
          )}

      {/* Assessments List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Assessments</h2>
          
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assessments created yet. Click "Create Assessment" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{assessment.title}</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {getAssessmentTypeLabel(assessment.type)}
                        </span>
                        {assessment.is_published ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Class:</span> {getClassName(assessment.class_id)}
                        </div>
                        <div>
                          <span className="font-medium">Assigned Ustaz:</span> {getUstazName(assessment.ustaz_id)}
                        </div>
                        <div>
                          <span className="font-medium">Total Marks:</span> {assessment.total_marks}
                        </div>
                        {assessment.date && (
                          <div>
                            <span className="font-medium">Date:</span> {assessment.date}
                          </div>
                        )}
                        {assessment.ethiopian_date && (
                          <div>
                            <span className="font-medium">Ethiopian Date:</span> {assessment.ethiopian_date}
                          </div>
                        )}
                      </div>
                      
                      {assessment.description && (
                        <p className="mt-2 text-sm text-gray-600">{assessment.description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(assessment)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={assessment.is_published ? "outline" : "default"}
                        onClick={() => handleTogglePublish(assessment)}
                      >
                        {assessment.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(assessment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Assessment Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingAssessment(null);
        }
        setIsModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] h-[calc(100vh-100px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update assessment details below. Changes will be saved immediately.'
                : 'Create a new assessment for a class. It will be saved as a draft until you publish it.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              {/* Title */}
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Assessment Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g., Semester 1 Final Exam"
                  required
                />
              </div>

              {/* Class Selection */}
              <div className="grid gap-2">
                <label htmlFor="class_id" className="text-sm font-medium">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="class_id"
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ustaz Selection */}
              <div className="grid gap-2">
                <label htmlFor="ustaz_id" className="text-sm font-medium">
                  Assign to Ustaz
                </label>
                <select
                  id="ustaz_id"
                  name="ustaz_id"
                  value={formData.ustaz_id}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">No specific Ustaz (all can access)</option>
                  {ustaz.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Type */}
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Assessment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="exam">Exam</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                </select>
              </div>

              {/* Total Marks */}
              <div className="grid gap-2">
                <label htmlFor="total_marks" className="text-sm font-medium">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  id="total_marks"
                  type="number"
                  name="total_marks"
                  value={formData.total_marks}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g., 100"
                  min="1"
                  required
                />
              </div>

              {/* Date */}
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date (Gregorian)
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Ethiopian Date */}
              <div className="grid gap-2">
                <label htmlFor="ethiopian_date" className="text-sm font-medium">
                  Ethiopian Date
                </label>
                <textarea
                  id="ethiopian_date"
                  name="ethiopian_date"
                  value={formData.ethiopian_date}
                  onChange={handleChange}
                  className="flex h-24 min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  placeholder="e.g., ጥር 10, 2017"
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex h-24 min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  placeholder="Enter assessment description (optional)"
                  rows={3}
                />
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingAssessment(null);
                setIsModalOpen(false);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                (isEditing ? 'Update Assessment' : 'Create Assessment')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </main>
      </div>
    </div>
  );
}
