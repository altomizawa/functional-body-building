'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDefaultJump } from '@/utils/smolovUtils';
import { X, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function Edit1RMPopup({
  isOpen,
  onClose,
  movement = 'back-squat',
  current1RM = 0,
  previous1RM = 0,
  weeklyJump,
  unit = 'lbs',
  onSave,
}) {
  const popupRef = useRef(null);
  const inputRef = useRef(null);

  const isBench = movement === 'bench-press';
  const movementName = isBench ? 'Bench Press' : 'Back Squat';

  const defaultJump = getDefaultJump(movement, unit);
  const [new1RM, setNew1RM] = useState('');
  const [jump, setJump] = useState(weeklyJump && weeklyJump > 0 ? weeklyJump : defaultJump);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset local state when modal opens or movement changes
  useEffect(() => {
    if (isOpen) {
      setNew1RM(current1RM > 0 ? String(current1RM) : '');
      setJump(weeklyJump && weeklyJump > 0 ? weeklyJump : getDefaultJump(movement, unit));
      setSelectedUnit(unit);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, movement, current1RM, weeklyJump, unit]);

  // Click outside and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed1RM = parseFloat(new1RM);
    if (isNaN(parsed1RM) || parsed1RM <= 0) {
      setError('Please enter a valid 1RM greater than 0.');
      return;
    }

    const parsedJump = parseFloat(jump);
    if (isNaN(parsedJump) || parsedJump < 0) {
      setError('Please enter a valid weekly jump value.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave({
        movement,
        new1RM: parsed1RM,
        weeklyJump: parsedJump,
        unit: selectedUnit,
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update 1RM. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        ref={popupRef}
        className="bg-neutral-900 border border-neutral-800 text-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Update 1RM
              </h2>
              <p className="text-sm text-neutral-400 font-medium">
                {movementName.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current vs Previous Comparison Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Previous 1RM
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-300">
                {previous1RM}
              </span>
              <span className="text-xs uppercase text-neutral-500 font-medium">
                {unit}
              </span>
            </div>
          </div>

          <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Current 1RM
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {current1RM}
              </span>
              <span className="text-xs uppercase text-neutral-500 font-medium">
                {unit}
              </span>
            </div>
          </div>
        </div>

        {/* Transition Notice */}
        <div className="text-xs bg-neutral-800/40 border border-neutral-800 rounded-lg p-3 text-neutral-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            When saved, your current 1RM (<strong>{current1RM} {unit}</strong>) will become your Previous 1RM, and this new value will become your Current 1RM.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* New 1RM Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-200 flex justify-between items-center">
              <span>New 1-Rep Max</span>
              <span className="text-xs text-neutral-400 font-normal">
                Active unit: {selectedUnit.toUpperCase()}
              </span>
            </label>
            <div className="relative">
              <Input
                ref={inputRef}
                type="number"
                step="any"
                min="1"
                placeholder="e.g. 250"
                value={new1RM}
                onChange={(e) => setNew1RM(e.target.value)}
                className="bg-neutral-950 border-neutral-700 h-12 text-xl font-bold pr-16 focus-visible:ring-emerald-500"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold uppercase text-neutral-500 select-none">
                {selectedUnit}
              </span>
            </div>
          </div>

          {/* Progressive Overload Jump Calibration */}
          <div className="flex flex-col gap-2 bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-neutral-200">
                Weekly Overload Jump
              </label>
              <span className="text-xs text-neutral-400">
                Added each week (Week 2 & 3)
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="relative w-36">
                <Input
                  type="number"
                  step="any"
                  min="0"
                  value={jump}
                  onChange={(e) => setJump(e.target.value)}
                  className="bg-neutral-900 border-neutral-700 h-10 text-base font-semibold pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-neutral-500">
                  {selectedUnit}
                </span>
              </div>

              <div className="text-xs text-neutral-400 leading-tight">
                {isBench ? (
                  <span>
                    <strong className="text-neutral-200">+5 lbs (+2.5 kg)</strong> standard for Bench Press to prevent missed reps.
                  </span>
                ) : (
                  <span>
                    <strong className="text-neutral-200">+10 lbs (+5 kg)</strong> standard for Back Squat progressive jumps.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Preferred Weight Unit</span>
            <div className="flex bg-neutral-950 rounded-lg p-1 border border-neutral-800">
              <button
                type="button"
                onClick={() => setSelectedUnit('lbs')}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  selectedUnit === 'lbs'
                    ? 'bg-neutral-200 text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                LBS
              </button>
              <button
                type="button"
                onClick={() => setSelectedUnit('kg')}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  selectedUnit === 'kg'
                    ? 'bg-neutral-200 text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                KG
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/40 border border-red-900/60 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/2 h-11 text-neutral-300 hover:text-white border-neutral-700 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 h-11 bg-white hover:bg-neutral-200 text-black font-bold shadow-lg"
            >
              {isSubmitting ? 'Saving...' : 'Update 1RM'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
