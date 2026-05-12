"use client";

import { useState, useEffect } from 'react';
import { StudentModel } from '@/models/Student';
import { ClassModel } from '@/models/Class';
import { studentService } from '@/lib/servies/studentService';
import { useData } from '@/context/dataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentModel | null;
  onSuccess: () => void;
}

export default function StudentModal({ isOpen, onClose, student, onSuccess }: StudentModalProps) {
  const { classes } = useData();
  const [formData, setFormData] = useState({
    full_name: '',
    parent_phone: '',
    class_id: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!student;

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        parent_phone: student.parent_phone || '',
        class_id: student.class_id || '',
        is_active: student.is_active ?? true
      });
    } else {
      setFormData({
        full_name: '',
        parent_phone: '',
        class_id: '',
        is_active: true
      });
    }
    setError('');
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.full_name.trim()) {
        throw new Error('Student name is required');
      }

      if (!formData.parent_phone.trim()) {
        throw new Error('Parent phone number is required');
      }

      if (!formData.class_id.trim()) {
        throw new Error('Class assignment is required');
      }

      const submitData = {
        full_name: formData.full_name.trim(),
        parent_phone: formData.parent_phone.trim(),
        class_id: formData.class_id.trim() || null,
        is_active: formData.is_active
      };

      if (isEditing && student) {
        await studentService.update(student.id, submitData);
      } else {
        await studentService.create(submitData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update student information below.' 
              : 'Create a new student account with details below.'
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
            {/* Student Name */}
            <div className="grid gap-2">
              <label htmlFor="full_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter student name"
                required
              />
            </div>

            {/* Parent Phone */}
            <div className="grid gap-2">
              <label htmlFor="parent_phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Parent Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="parent_phone"
                type="tel"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="09########"
                required
              />
            </div>

            {/* Class Assignment */}
            <div className="grid gap-2">
              <label htmlFor="class_id" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Class Assignment <span className="text-red-500">*</span>
              </label>
              <select
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a class</option>
                {classes.map((classItem: ClassModel) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Active
              </label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </>
            ) : (
              (isEditing ? 'Update' : 'Create')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
