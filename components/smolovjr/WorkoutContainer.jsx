'use client'

import React, { useState, useTransition } from 'react';
import WorkoutCard from './WorkoutCard';
import Edit1RMPopup from './Edit1RMPopup';
import { Button } from '../ui/button';
import { calculateSmolovDays, getDefaultJump } from '@/utils/smolovUtils';
import {
  updateSmolov1RM,
  toggleSmolovDayCompletion,
  resetSmolovProgram,
} from '@/lib/smolovActions';
import {
  Dumbbell,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function WorkoutContainer({ initialData }) {
  const [data, setData] = useState(initialData || {});
  const [movement, setMovement] = useState(initialData?.activeMovement || 'back-squat');
  const [currentDay, setCurrentDay] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeWeekTab, setActiveWeekTab] = useState('all'); // 'all' | 1 | 2 | 3
  const [isPending, startTransition] = useTransition();

  const isBackSquat = movement === 'back-squat';
  const isBenchPress = movement === 'bench-press';
  const movementName = isBenchPress ? 'Bench Press' : 'Back Squat';
  const movKey = isBenchPress ? 'benchPress' : 'backSquat';

  const unit = data?.unit || 'lbs';
  const movementData = data?.[movKey] || {
    current1RM: 0,
    previous1RM: 0,
    weeklyJump: getDefaultJump(movement, unit),
    completedDays: [],
  };

  const current1RM = movementData.current1RM || 0;
  const previous1RM = movementData.previous1RM || 0;
  const weeklyJump = movementData.weeklyJump || getDefaultJump(movement, unit);
  const completedDays = movementData.completedDays || [];

  // Calculate 12 days using progressive overload rules
  const allDays = calculateSmolovDays({
    current1RM,
    weeklyJump,
    movement,
    unit,
    completedDays,
  });

  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / 12) * 100);

  // Filter by selected week
  const visibleDays =
    activeWeekTab === 'all'
      ? allDays
      : allDays.filter((d) => d.week === Number(activeWeekTab));

  // Handler: Update 1RM & Jump
  const handleSave1RM = async ({ movement: targetMovement, new1RM, weeklyJump: newJump, unit: newUnit }) => {
    // Optimistic state update
    const targetKey = targetMovement === 'bench-press' ? 'benchPress' : 'backSquat';
    const oldCurrent = data?.[targetKey]?.current1RM || 0;

    setData((prev) => ({
      ...prev,
      unit: newUnit,
      [targetKey]: {
        ...(prev?.[targetKey] || {}),
        previous1RM: oldCurrent,
        current1RM: new1RM,
        weeklyJump: newJump,
      },
    }));

    startTransition(async () => {
      const res = await updateSmolov1RM({
        movement: targetMovement,
        new1RM,
        weeklyJump: newJump,
        unit: newUnit,
      });
      if (res?.success && res.data) {
        setData(res.data);
      }
    });
  };

  // Handler: Toggle workout completed/uncompleted
  const handleToggleComplete = async (dayId) => {
    // Optimistic toggle
    const today = new Date();
    const dStr = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;

    setData((prev) => {
      const existing = prev?.[movKey]?.completedDays || [];
      const hasCompleted = existing.some((d) => d.dayId === dayId);
      const updated = hasCompleted
        ? existing.filter((d) => d.dayId !== dayId)
        : [...existing, { dayId, completedDate: dStr, completedAt: today }];

      return {
        ...prev,
        [movKey]: {
          ...(prev?.[movKey] || {}),
          completedDays: updated,
        },
      };
    });

    startTransition(async () => {
      const res = await toggleSmolovDayCompletion({ movement, dayId });
      if (res?.success && res.data) {
        setData(res.data);
      }
    });
  };

  // Handler: Reset program for current movement
  const handleResetProgram = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset your completed workouts for ${movementName}? Your 1RM values will remain saved.`
    );
    if (!confirmed) return;

    setData((prev) => ({
      ...prev,
      [movKey]: {
        ...(prev?.[movKey] || {}),
        completedDays: [],
      },
    }));

    startTransition(async () => {
      const res = await resetSmolovProgram({ movement });
      if (res?.success && res.data) {
        setData(res.data);
      }
    });
  };

  return (
    <main className="flex flex-col gap-10 items-center justify-center w-full px-4 sm:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Title & Introduction */}
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
          Smolov Jr.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl">
          High-frequency 3-week specialization program. Driven by fixed progressive overload jumps added weekly to your working weights.
        </p>
      </div>

      {/* Movement Switcher */}
      <div className="flex p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full">
        <button
          onClick={() => {
            setMovement('back-squat');
            setCurrentDay(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            isBackSquat
              ? 'bg-white text-black shadow-lg shadow-white/5'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          BACK SQUAT
        </button>

        <button
          onClick={() => {
            setMovement('bench-press');
            setCurrentDay(null);
          }}
          className={`flex-1 py-3 px-4 rounded-lg text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            isBenchPress
              ? 'bg-white text-black shadow-lg shadow-white/5'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          BENCH PRESS
        </button>
      </div>

      {/* 1RM Stats Banner & Controls */}
      <div className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-12">
          {/* Previous 1RM */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Previous 1RM
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-300">
                {previous1RM}
              </span>
              <span className="text-sm font-semibold uppercase text-neutral-400">
                {unit}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-neutral-800 hidden sm:block" />

          {/* Current 1RM */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Current 1RM
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                {current1RM}
              </span>
              <span className="text-sm font-semibold uppercase text-neutral-400">
                {unit}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-neutral-800 hidden sm:block" />

          {/* Weekly Jump */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
              Weekly Jump
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
                +{weeklyJump}
              </span>
              <span className="text-sm font-semibold uppercase text-neutral-400">
                {unit}/wk
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <Button
              variant="outline"
              onClick={handleResetProgram}
              className="border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs sm:text-sm h-11"
              title="Reset completed workouts"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset Cycle
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
            className="h-11 px-6 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <TrendingUp className="w-4 h-4" />
            {current1RM > 0 ? 'Edit 1RM' : 'Set 1RM'}
          </Button>
        </div>
      </div>

      {/* Zero 1RM Warning/Callout */}
      {current1RM === 0 && (
        <div className="w-full bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex items-center gap-3 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <p>
            You haven't entered a 1RM for <strong>{movementName}</strong> yet. Click{' '}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="underline font-bold hover:text-white"
            >
              Set 1RM
            </button>{' '}
            above to automatically calculate all working weights!
          </p>
        </div>
      )}

      {/* Program Progression Info & Progress Bar */}
      <div className="w-full flex flex-col gap-4">
        {/* Progress Bar & Week Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Cycle Progress
              </span>
              <span className="text-sm font-bold text-white">
                {completedCount} / 12 Workouts Completed ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Week Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setActiveWeekTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeWeekTab === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Weeks
            </button>
            <button
              onClick={() => setActiveWeekTab('1')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeWeekTab === '1'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Week 1 (Base)
            </button>
            <button
              onClick={() => setActiveWeekTab('2')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeWeekTab === '2'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Week 2 (+{weeklyJump})
            </button>
            <button
              onClick={() => setActiveWeekTab('3')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeWeekTab === '3'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Week 3 (+{weeklyJump * 2})
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-neutral-950 rounded-full h-2 border border-neutral-800/80 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Workout Cards Grid */}
      <ul className="flex flex-wrap gap-6 justify-center w-full">
        {visibleDays.map((day) => (
          <WorkoutCard
            key={day.id}
            day={day}
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
            movementName={movementName}
            unit={unit}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </ul>

      {/* Edit 1RM Popup */}
      <Edit1RMPopup
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        movement={movement}
        current1RM={current1RM}
        previous1RM={previous1RM}
        weeklyJump={weeklyJump}
        unit={unit}
        onSave={handleSave1RM}
      />
    </main>
  );
}