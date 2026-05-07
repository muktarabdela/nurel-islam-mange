"use client";

import { useState, useEffect } from 'react';
import { UstazModel } from '@/models/Ustaz';
import { CreateUstazPayload, UpdateUstazPayload, ustazService } from '@/lib/servies/ustazService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UstazModalProps {
  isOpen: boolean;
  onClose: () => void;
  ustaz?: UstazModel | null;
  onSuccess: () => void;
}

export default function UstazModal({ isOpen, onClose, ustaz, onSuccess }: UstazModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    is_active: true,
    must_change_password: false,
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!ustaz;

  useEffect(() => {
    if (ustaz) {
      setFormData({
        full_name: ustaz.full_name || '',
        phone_number: ustaz.phone_number || '',
        is_active: ustaz.is_active ?? true,
        must_change_password: ustaz.must_change_password ?? false,
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        full_name: '',
        phone_number: '',
        is_active: true,
        must_change_password: false,
        password: '',
        confirmPassword: ''
      });
    }
    setError('');
  }, [ustaz, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required');
      }

      if (!isEditing && !formData.password) {
        throw new Error('Password is required for new ustaz');
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password && formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const submitData: CreateUstazPayload | UpdateUstazPayload = {
        full_name: formData.full_name.trim(),
        phone_number: formData.phone_number.trim() || null,
        is_active: formData.is_active,
        must_change_password: formData.must_change_password
      };

      if (formData.password) {
        (submitData as any).password = formData.password;
      }

      if (isEditing && ustaz) {
        await ustazService.update(ustaz.id, submitData as UpdateUstazPayload);
      } else {
        await ustazService.create(submitData as CreateUstazPayload);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
<DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Ustaz' : 'Add New Ustaz'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the ustaz information below.' 
              : 'Create a new ustaz account with the details below.'
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
            {/* Full Name */}
            <div className="grid gap-2">
              <label htmlFor="full_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="grid gap-2">
              <label htmlFor="phone_number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="+60 12-345 6789"
              />
            </div>



            {/* Checkboxes */}
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
                name="must_change_password"
                id="must_change_password"
                checked={formData.must_change_password}
                onChange={handleChange}
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label htmlFor="must_change_password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Must change password on first login
              </label>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                required={!isEditing}
              />
            </div>

            {/* Confirm Password */}
            {formData.password && (
              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Confirm password"
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
