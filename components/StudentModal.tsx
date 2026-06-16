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
    parent_name: '',
    father_phone_number: '',
    mother_phone_number: '',
    age: '',
    address: '',
    class_id: '',
    is_active: true,
    paid_first_month: false,
    is_summer_student: false,
    is_free_student: false,
    is_new_student: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!student;

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        parent_phone: student.parent_phone || '',
        parent_name: student.parent_name || '',
        father_phone_number: student.father_phone_number || '',
        mother_phone_number: student.mother_phone_number || '',
        age: student.age?.toString() || '',
        address: student.address || '',
        class_id: student.class_id || '',
        is_active: student.is_active ?? true,
        paid_first_month: student.paid_first_month ?? false,
        is_summer_student: student.is_summer_student ?? false,
        is_free_student: student.is_free_student ?? false,
        is_new_student: student.is_new_student ?? false
      });
    } else {
      setFormData({
        full_name: '',
        parent_phone: '',
        parent_name: '',
        father_phone_number: '',
        mother_phone_number: '',
        age: '',
        address: '',
        class_id: '',
        is_active: true,
        paid_first_month: false,
        is_summer_student: false,
        is_free_student: false,
        is_new_student: false
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
        parent_name: formData.parent_name.trim(),
        father_phone_number: formData.father_phone_number.trim(),
        mother_phone_number: formData.mother_phone_number.trim(),
        age: formData.age ? parseInt(formData.age) : undefined,
        address: formData.address.trim(),
        class_id: formData.class_id.trim() || null,
        is_active: formData.is_active,
        paid_first_month: formData.paid_first_month,
        paid_second_month: student?.paid_second_month ?? false,
        is_summer_student: formData.is_summer_student,
        is_free_student: formData.is_free_student,
        is_new_student: formData.is_new_student
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
            {/* Student Name - Full Width */}
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

            {/* Parent Phone and Parent Name - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="grid gap-2">
                <label htmlFor="parent_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Parent Name
                </label>
                <input
                  id="parent_name"
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter parent name"
                />
              </div>
            </div>

            {/* Father's and Mother's Phone Numbers - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="father_phone_number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Father's Phone
                </label>
                <input
                  id="father_phone_number"
                  type="tel"
                  name="father_phone_number"
                  value={formData.father_phone_number}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="09########"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="mother_phone_number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mother's Phone
                </label>
                <input
                  id="mother_phone_number"
                  type="tel"
                  name="mother_phone_number"
                  value={formData.mother_phone_number}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="09########"
                />
              </div>
            </div>

            {/* Age and Address - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="age" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter age"
                  min="1"
                  max="100"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter address"
                />
              </div>
            </div>

            {/* Class Assignment - Full Width */}
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

            {/* Checkboxes - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="paid_first_month"
                  id="paid_first_month"
                  checked={formData.paid_first_month}
                  onChange={handleChange}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label htmlFor="paid_first_month" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Paid First Month
                </label>
              </div>

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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_new_student"
                  id="is_new_student"
                  checked={formData.is_new_student}
                  onChange={handleChange}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label htmlFor="is_new_student" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  New Student
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_summer_student"
                  id="is_summer_student"
                  checked={formData.is_summer_student}
                  onChange={handleChange}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label htmlFor="is_summer_student" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Summer Student
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_free_student"
                  id="is_free_student"
                  checked={formData.is_free_student}
                  onChange={handleChange}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label htmlFor="is_free_student" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Free Student
                </label>
              </div>
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
