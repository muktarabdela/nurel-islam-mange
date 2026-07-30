"use client";

import { useState } from 'react';
import { useData } from '@/context/dataContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';
import { exportStudentMarksToPDF } from '@/utils/exportStudentMarkPdf';

interface StudentMarkExportProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

export function StudentMarkExport({ isOpen, onClose, classId, className }: StudentMarkExportProps) {
  const { students, assessments, studentMarks, loading } = useData();
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Get assessments for this class
  const classAssessments = assessments.filter(a => a.class_id === classId);

  // Get active students in this class
  const activeStudents = students.filter(student => student.class_id === classId && student.is_active);

  // Filter student marks for selected assessments
  const filteredStudentMarks = selectedAssessmentIds.length > 0
    ? studentMarks.filter(mark => 
        selectedAssessmentIds.includes(mark.assessment_id) &&
        activeStudents.some(s => s.id === mark.student_id)
      )
    : [];

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
    if (selectedAssessmentIds.length === classAssessments.length) {
      setSelectedAssessmentIds([]);
    } else {
      setSelectedAssessmentIds(classAssessments.map(a => a.id));
    }
  };

  // Handle export
  const handleExport = async () => {
    if (selectedAssessmentIds.length === 0 || activeStudents.length === 0) return;

    setIsExporting(true);
    try {
      const selectedAssessments = classAssessments.filter(a => selectedAssessmentIds.includes(a.id));
      
      exportStudentMarksToPDF({
        students: activeStudents,
        assessments: selectedAssessments,
        studentMarks: filteredStudentMarks,
        className: className
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
      <DialogContent className="sm:max-w-[600px]">
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

          {/* Assessment Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Assessments *</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading || classAssessments.length === 0}
              >
                {selectedAssessmentIds.length === classAssessments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            {classAssessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assessments found for this class.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {classAssessments.map((assessment) => (
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
          {!canExport && classAssessments.length > 0 && (
            <p className="text-sm text-amber-600">
              {activeStudents.length === 0 
                ? 'No active students found in this class.'
                : 'Please select at least one assessment to export.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
