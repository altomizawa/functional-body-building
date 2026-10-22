'use client'

import React from 'react';
import ConfirmationPopup from '@/components/smolovjr/confirmationPopup';
import { CheckCircle, Calendar } from 'lucide-react';

export default function WorkoutCard({
  day,
  currentDay,
  setCurrentDay,
  movementName = 'Back Squat',
  unit = 'lbs',
  onToggleComplete,
}) {
  const isSelected = day.id === currentDay;
  const isCompleted = Boolean(day.completedDate);
  const displayUnit = (unit || 'lbs').toUpperCase();

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setCurrentDay(null);
    } else {
      setCurrentDay(day.id);
    }
  };

  const handleConfirm = () => {
    if (onToggleComplete) {
      onToggleComplete(day.id);
    }
    setCurrentDay(null);
  };

  const handleCancel = () => {
    setCurrentDay(null);
  };

  return (
    <li
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-200 cursor-pointer select-none w-full sm:w-[380px] flex flex-col justify-between ${
        isCompleted
          ? 'bg-neutral-900/90 border-emerald-600/50 shadow-lg shadow-emerald-950/20'
          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[4rem] sm:text-[4.5rem] font-black leading-none uppercase tracking-tighter text-neutral-400 group-hover:text-neutral-200 transition-colors">
              {day.day}
            </p>
            <p className="text-sm font-semibold text-neutral-400 -mt-2 ml-1">
              {movementName}
            </p>
          </div>

          {/* Jump / Base Badge */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700">
              {day.pct ? `${day.pct}%` : 'Base'}
              {day.jumpAdded > 0 && ` +${day.jumpAdded}`}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
              Week {day.week}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full text-center mt-6 py-3 border-y border-neutral-800/70 bg-neutral-900/40 rounded-lg">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-light text-white tracking-tight">{day.sets}</p>
            <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">SETS</p>
          </div>
          <div className="flex flex-col items-center border-x border-neutral-800/80">
            <p className="text-3xl font-light text-white tracking-tight">{day.reps}</p>
            <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">REPS</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-emerald-400 tracking-tight">
              {day.weight > 0 ? day.weight : '—'}
            </p>
            <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">
              {displayUnit}
            </p>
          </div>
        </div>
      </div>

      {/* Completion Footer */}
      <div className="flex justify-between items-center mt-6 pt-2">
        <div className="flex items-center gap-1.5 text-xs">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Completed {day.completedDate}
            </span>
          ) : (
            <span className="text-neutral-400">Not Completed</span>
          )}
        </div>

        <CheckCircle
          size={28}
          className={`transition-colors ${
            isCompleted
              ? 'text-emerald-500 fill-emerald-500/10'
              : 'text-neutral-600 group-hover:text-neutral-500'
          }`}
        />
      </div>

      {/* Confirmation Popup Overlay */}
      {isSelected && (
        <ConfirmationPopup
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isCompleted={isCompleted}
        />
      )}
    </li>
  );
}