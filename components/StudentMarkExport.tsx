"use client";

import { useState, useEffect } from 'react';
import { useData } from '@/context/dataContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, User } from 'lucide-react';
import { exportStudentMarksToPDF } from '@/utils/exportStudentMarkPdf';
import { assessmentService } from '@/lib/servies/assessmentService';
import { studentMarkService } from '@/lib/servies/studentMarkService';
import { AssessmentModel } from '@/models/Assessment';
import { StudentMarkModel } from '@/models/StudentMark';

interface StudentMarkExportProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

export function StudentMarkExport({ isOpen, onClose, classId, className }: StudentMarkExportProps) {
  const { students, ustaz, classUstaz } = useData();
  const [classAssessments, setClassAssessments] = useState<AssessmentModel[]>([]);
  const [classStudentMarks, setClassStudentMarks] = useState<StudentMarkModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>([]);
  const [selectedUstazId, setSelectedUstazId] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch assessments and marks for this class when dialog opens
  useEffect(() => {
    async function fetchData() {
      if (isOpen && classId) {
        setLoading(true);
        try {
          const [assessmentsData, marksData] = await Promise.all([
            assessmentService.getByClass(classId),
            studentMarkService.getMarksByClass(classId)
          ]);
          setClassAssessments(assessmentsData);
          setClassStudentMarks(marksData);
        } catch (error) {
          console.error('Failed to fetch assessment data:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [isOpen, classId]);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAssessmentIds([]);
      setSelectedUstazId('all');
    }
  }, [isOpen]);

  // Get ustazs assigned to this class
  const classUstazs = classUstaz.filter(cu => cu.class_id === classId);
  const assignedUstazs = ustaz.filter(u => classUstazs.some(cu => cu.ustaz_id === u.id));

  // Filter assessments based on selected ustaz and completion status
  const filteredAssessments = selectedUstazId !== 'all'
    ? classAssessments.filter(a => {
        // Must be assigned to selected ustaz OR have no specific ustaz (ustaz can still mark)
        if (a.ustaz_id && a.ustaz_id !== selectedUstazId) return false;

        // Must have marks recorded by this ustaz (completed)
        const hasMarks = classStudentMarks.some(
          m => m.assessment_id === a.id && m.recorded_by === selectedUstazId
        );
        return hasMarks;
      })
    : classAssessments;

  // Get active students in this class
  const activeStudents = students.filter(student => student.class_id === classId && student.is_active);

  // Filter student marks for selected assessments and active students
  // If a specific ustaz is selected, only include marks recorded by that ustaz
  const filteredStudentMarks = classStudentMarks.filter(mark =>
    activeStudents.some(s => s.id === mark.student_id) &&
    selectedAssessmentIds.includes(mark.assessment_id) &&
    (selectedUstazId === 'all' || mark.recorded_by === selectedUstazId)
  );

  // Handle assessment selection
  const handleAssessmentToggle = (assessmentId: string) => {
    setSelectedAssessmentIds(prev => 
      prev.includes(assessmentId)
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  // Handle select all assessments
  const handleSelectAll = () => {
    if (selectedAssessmentIds.length === filteredAssessments.length) {
      setSelectedAssessmentIds([]);
    } else {
      setSelectedAssessmentIds(filteredAssessments.map(a => a.id));
    }
  };

  // Handle ustaz selection change
  const handleUstazChange = (ustazId: string) => {
    setSelectedUstazId(ustazId);
    setSelectedAssessmentIds([]); // Reset assessment selection when ustaz changes
  };

  // Check if assessment is completed by specific ustaz
  const isAssessmentCompletedByUstaz = (assessmentId: string, ustazId: string) => {
    return classStudentMarks.some(
      m => m.assessment_id === assessmentId && m.recorded_by === ustazId
    );
  };

  // Handle export
  const handleExport = async () => {
    if (selectedAssessmentIds.length === 0 || activeStudents.length === 0) return;

    setIsExporting(true);
    try {
      const selectedAssessments = filteredAssessments.filter(a => selectedAssessmentIds.includes(a.id));
      const selectedUstaz = selectedUstazId !== 'all' ? ustaz.find(u => u.id === selectedUstazId) : undefined;
      
      exportStudentMarksToPDF({
        students: activeStudents,
        assessments: selectedAssessments,
        studentMarks: filteredStudentMarks,
        className: className,
        ustazName: selectedUstaz?.full_name
      });
      setIsExporting(false);
      handleExportSuccess();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedAssessmentIds([]);
  };

  // Handle successful export
  const handleExportSuccess = () => {
    handleReset();
    onClose();
  };

  const canExport = selectedAssessmentIds.length > 0 && activeStudents.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Student Marks PDF
          </DialogTitle>
          <DialogDescription>
            Generate a PDF report of student marks for selected assessments
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Class Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {className}
            </Badge>
          </div>

          {/* Ustaz Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Filter by Ustaz
            </label>
            <Select value={selectedUstazId} onValueChange={handleUstazChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Ustazs (show all assessments)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ustazs (show all assessments)</SelectItem>
                {assignedUstazs.map((ustaz) => (
                  <SelectItem key={ustaz.id} value={ustaz.id}>
                    {ustaz.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedUstazId !== 'all' && (
              <p className="text-xs text-muted-foreground">
                Showing only completed assessments by selected ustaz
              </p>
            )}
          </div>

          {/* Assessment Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Assessments *</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading || filteredAssessments.length === 0}
              >
                {selectedAssessmentIds.length === filteredAssessments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            {filteredAssessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {selectedUstazId !== 'all' 
                  ? 'No completed assessments found for this ustaz.' 
                  : 'No assessments found for this class.'}
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {filteredAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleAssessmentToggle(assessment.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssessmentIds.includes(assessment.id)}
                      onChange={() => handleAssessmentToggle(assessment.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{assessment.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {assessment.type} • {assessment.total_marks} marks
                        {selectedUstazId !== 'all' && isAssessmentCompletedByUstaz(assessment.id, selectedUstazId) && (
                          <span className="ml-2 text-green-600">✓ Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Section */}
          {selectedAssessmentIds.length > 0 && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Export Preview</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Class:</span>
                  <Badge variant="secondary">{className}</Badge>
                </div>
                {selectedUstazId !== 'all' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ustaz:</span>
                    <Badge variant="outline">
                      {ustaz.find(u => u.id === selectedUstazId)?.full_name}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Assessments:</span>
                  <Badge variant="default">{selectedAssessmentIds.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active Students:</span>
                  <Badge variant="outline">{activeStudents.length}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleExport}
              disabled={!canExport || isExporting}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isExporting}
            >
              Reset
            </Button>
          </div>

          {/* Status Messages */}
          {!canExport && filteredAssessments.length > 0 && (
            <p className="text-sm text-amber-600">
              {activeStudents.length === 0 
                ? 'No active students found in this class.'
                : 'Please select at least one assessment to export.'}
            </p>
          )}
          
          {filteredAssessments.length === 0 && selectedUstazId !== 'all' && (
            <p className="text-sm text-amber-600">
              This ustaz hasn't completed any assessments yet. Select "All Ustazs" to see all assessments.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
