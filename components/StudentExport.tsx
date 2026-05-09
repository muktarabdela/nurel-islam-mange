"use client";

import { useState } from 'react';
import { useData } from '@/context/dataContext';
import { exportStudentsToPDF } from '@/utils/exportStudentsPdf';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';

interface StudentExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentExport({ isOpen, onClose }: StudentExportProps) {
  const { students, classes, ustaz, loading } = useData();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedUstazId, setSelectedUstazId] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Get selected class data
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedUstaz = selectedUstazId !== 'all' ? ustaz.find(u => u.id === selectedUstazId) : undefined;

  // Filter students by selected class
  const filteredStudents = selectedClassId
    ? students.filter(student => student.class_id === selectedClassId && student.is_active)
    : [];

  // Handle export
  const handleExport = async () => {
    if (!selectedClass || filteredStudents.length === 0) return;

    setIsExporting(true);
    try {
      exportStudentsToPDF({
        students: filteredStudents,
        classData: selectedClass,
        ustazData: selectedUstaz
      });
      setIsExporting(false); // Reset exporting state
      handleExportSuccess();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedClassId('');
    setSelectedUstazId('all');
  };

  // Handle successful export
  const handleExportSuccess = () => {
    handleReset();
    onClose();
  };

  const canExport = selectedClass && filteredStudents.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Students PDF
          </DialogTitle>
          <DialogDescription>
            Generate a PDF report of students filtered by class and optionally by ustaz
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
        {/* Class Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Class *</label>
          <Select
            value={selectedClassId}
            onValueChange={(value) => {
              setSelectedClassId(value);
              setSelectedUstazId('all'); // Reset ustaz when class changes
            }}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ustaz Selection (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ustaz (Optional)</label>
          <Select
            value={selectedUstazId}
            onValueChange={setSelectedUstazId}
            disabled={loading || !selectedClassId}
          >
            <SelectTrigger>
              <SelectValue placeholder="All ustaz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ustaz</SelectItem>
              {ustaz
                .filter(u => u.is_active)
                .map((ustazItem) => (
                  <SelectItem key={ustazItem.id} value={ustazItem.id}>
                    {ustazItem.full_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview Section */}
        {selectedClass && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700">Export Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Class:</span>
                <Badge variant="secondary">{selectedClass.name}</Badge>
              </div>
              {selectedUstaz && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Ustaz:</span>
                  <Badge variant="outline">{selectedUstaz.full_name}</Badge>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Students:</span>
                <Badge variant="default">{filteredStudents.length}</Badge>
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
        {!canExport && selectedClassId && (
          <p className="text-sm text-amber-600">
            No active students found in this class.
          </p>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
