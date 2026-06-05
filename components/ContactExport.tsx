"use client";

import { useState } from 'react';
import { useData } from '@/context/dataContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, Download, AlertCircle } from 'lucide-react';

interface ContactExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactExport({ isOpen, onClose }: ContactExportProps) {
  const { students, classes, loading } = useData();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  // Get selected class data
  const selectedClass = classes.find(c => c.id === selectedClassId);

  // Validate phone number: remove non-digits, check if exactly 10 digits
  const validatePhoneNumber = (phone: string | null | undefined): string | null => {
    if (!phone) return null;
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if exactly 10 digits
    if (digitsOnly.length === 10) {
      return digitsOnly;
    }
    
    // Ignore incomplete numbers
    return null;
  };

  // Filter and process students
  const processContacts = () => {
    if (!selectedClassId) return [];
    
    const filteredStudents = students.filter(student => 
      student.class_id === selectedClassId && student.is_active
    );

    const contacts: { name: string; phone: string }[] = [];
    const phoneSet = new Set<string>();

    filteredStudents.forEach(student => {
      const validPhone = validatePhoneNumber(student.parent_phone);
      
      if (validPhone) {
        // Remove duplicates by checking if phone number already exists
        if (!phoneSet.has(validPhone)) {
          phoneSet.add(validPhone);
          contacts.push({
            name: student.full_name,
            phone: validPhone
          });
        }
      }
    });

    return contacts;
  };

  const contacts = processContacts();

  // Generate CSV for Google Contacts
  const generateCSV = () => {
    const headers = 'Name,Phone Number\n';
    const rows = contacts.map(contact => 
      `"${contact.name}","${contact.phone}"`
    ).join('\n');
    
    return headers + rows;
  };

  // Handle export
  const handleExport = () => {
    if (!selectedClass || contacts.length === 0) return;

    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedClass.name}_contacts.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      handleExportSuccess();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedClassId('');
  };

  // Handle successful export
  const handleExportSuccess = () => {
    handleReset();
    onClose();
  };

  const canExport = selectedClass && contacts.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Download Contacts
          </DialogTitle>
          <DialogDescription>
            Export student names and parent phone numbers as a CSV file compatible with Google Contacts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
        {/* Class Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Class *</label>
          <Select
            value={selectedClassId}
            onValueChange={setSelectedClassId}
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

        {/* Preview Section */}
        {selectedClass && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700">Export Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Class:</span>
                <Badge variant="secondary">{selectedClass.name}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Valid Contacts:</span>
                <Badge variant="default">{contacts.length}</Badge>
              </div>
              {selectedClass && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    Only 10-digit phone numbers are included. Incomplete or invalid numbers are automatically filtered out. Duplicate phone numbers are removed.
                  </p>
                </div>
              )}
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
            {isExporting ? 'Downloading...' : 'Download CSV'}
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
            No valid phone numbers found in this class. Phone numbers must be exactly 10 digits.
          </p>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
