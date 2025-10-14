import { useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

export function useAutoSave(data, saveFunction, options = {}) {
  const {
    interval = 30000, // 30 seconds
    enabled = true,
    onSave,
    onError,
    dependencies = []
  } = options;

  const { toast } = useToast();
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const isSavingRef = useRef(false);

  const hasChanges = useCallback(() => {
    if (!lastSavedRef.current) return true;
    
    // Simple deep comparison - in a real app, you might want to use a library like lodash
    return JSON.stringify(data) !== JSON.stringify(lastSavedRef.current);
  }, [data]);

  const save = useCallback(async () => {
    if (isSavingRef.current || !hasChanges()) return;

    try {
      isSavingRef.current = true;
      await saveFunction(data);
      lastSavedRef.current = JSON.parse(JSON.stringify(data));
      onSave?.(data);
    } catch (error) {
      console.error('Auto-save failed:', error);
      onError?.(error);
      toast({
        title: "Auto-save Failed",
        description: "Your changes could not be saved automatically.",
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [data, saveFunction, hasChanges, onSave, onError, toast]);

  const scheduleSave = useCallback(() => {
    if (!enabled || !hasChanges()) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule new save
    timeoutRef.current = setTimeout(save, interval);
  }, [enabled, hasChanges, save, interval]);

  // Schedule save when data changes
  useEffect(() => {
    scheduleSave();
  }, [scheduleSave, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  // Force save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return {
    manualSave,
    hasUnsavedChanges: hasChanges(),
    isSaving: isSavingRef.current
  };
}
