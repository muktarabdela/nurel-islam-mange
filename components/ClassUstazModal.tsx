"use client";

import { useState, useEffect } from 'react';
import { ClassModel } from '@/models/Class';
import { UstazModel } from '@/models/Ustaz';
import { classUstazService } from '@/lib/servies/classUstazService';
import { useData } from '@/context/dataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ClassUstazModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: ClassModel | null;
  onSuccess: () => void;
}

interface ClassUstazWithUstaz {
  id: string;
  class_id: string;
  ustaz_id: string;
  ustaz: UstazModel;
}

export default function ClassUstazModal({ isOpen, onClose, class: classItem, onSuccess }: ClassUstazModalProps) {
  const [selectedUstazId, setSelectedUstazId] = useState('');
  const [assignedUstaz, setAssignedUstaz] = useState<ClassUstazWithUstaz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { ustaz } = useData();

  useEffect(() => {
    if (isOpen && classItem) {
      fetchAssignedUstaz();
      setSelectedUstazId('');
      setError('');
    }
  }, [isOpen, classItem]);

  const fetchAssignedUstaz = async () => {
    if (!classItem) return;
    
    try {
      const data = await classUstazService.getByClass(classItem.id);
      setAssignedUstaz(data);
    } catch (err) {
      console.error('Error fetching assigned ustaz:', err);
    }
  };

  const handleAssignUstaz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classItem || !selectedUstazId) return;

    setError('');
    setLoading(true);

    try {
      // Check if ustaz is already assigned
      const isAlreadyAssigned = assignedUstaz.some(assignment => assignment.ustaz_id === selectedUstazId);
      if (isAlreadyAssigned) {
        throw new Error('This ustaz is already assigned to this class');
      }

      await classUstazService.assign(classItem.id, selectedUstazId);
      await fetchAssignedUstaz();
      setSelectedUstazId('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign ustaz');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUstaz = async (ustazId: string) => {
    if (!classItem) return;

    try {
      await classUstazService.remove(classItem.id, ustazId);
      await fetchAssignedUstaz();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ustaz');
    }
  };

  if (!isOpen || !classItem) return null;

  const availableUstaz = ustaz.filter(u => !assignedUstaz.some(assignment => assignment.ustaz_id === u.id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Ustaz Assignment - {classItem.name}</DialogTitle>
          <DialogDescription>
            Assign or remove ustaz from this class.
          </DialogDescription>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Assign Ustaz Form */}
        <form onSubmit={handleAssignUstaz} className="space-y-4">
          <div className="flex gap-2">
            <select
              value={selectedUstazId}
              onChange={(e) => setSelectedUstazId(e.target.value)}
              className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={loading || availableUstaz.length === 0}
            >
              <option value="">Select an ustaz to assign</option>
              {availableUstaz.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} {u.phone_number && `(${u.phone_number})`}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              disabled={loading || !selectedUstazId}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Assigning...
                </>
              ) : (
                'Assign Ustaz'
              )}
            </Button>
          </div>
        </form>

        {/* Currently Assigned Ustaz */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Currently Assigned Ustaz</h3>
          {assignedUstaz.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ustaz assigned to this class yet.</p>
          ) : (
            <div className="space-y-2">
              {assignedUstaz.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold ">
                      {assignment.ustaz.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{assignment.ustaz.full_name}</div>
                      {assignment.ustaz.phone_number && (
                        <div className="text-xs text-muted-foreground">{assignment.ustaz.phone_number}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveUstaz(assignment.ustaz_id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
