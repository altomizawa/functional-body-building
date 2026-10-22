/**
 * Smolov Jr Program Calculation Utility
 *
 * 3 Weeks, 4 Days per week.
 *
 * Base Percentages:
 * Day 1: 6 sets x 6 reps @ 70%
 * Day 2: 7 sets x 5 reps @ 75%
 * Day 3: 8 sets x 4 reps @ 80%
 * Day 4: 9 sets x 3 reps @ 85%
 *
 * Progressive Overload:
 * Week 1: Base percentages
 * Week 2: Base weight + 1x weekly jump
 * Week 3: Base weight + 2x weekly jump (jump added on top of Week 2)
 */

export const DEFAULT_JUMPS = {
  lbs: {
    'bench-press': 5,
    'back-squat': 10,
  },
  kg: {
    'bench-press': 2.5,
    'back-squat': 5,
  },
};

export function getDefaultJump(movement = 'back-squat', unit = 'lbs') {
  const normUnit = unit.toLowerCase() === 'kg' ? 'kg' : 'lbs';
  const normMov = movement === 'bench-press' ? 'bench-press' : 'back-squat';
  return DEFAULT_JUMPS[normUnit][normMov];
}

export function calculateSmolovDays({
  current1RM = 0,
  weeklyJump,
  movement = 'back-squat',
  unit = 'lbs',
  completedDays = [],
}) {
  const normMovement = movement === 'bench-press' ? 'bench-press' : 'back-squat';
  const effectiveJump =
    typeof weeklyJump === 'number' && weeklyJump > 0
      ? weeklyJump
      : getDefaultJump(normMovement, unit);

  const baseConfig = [
    { dayIndex: 1, sets: '6', reps: '6', pct: 0.70 },
    { dayIndex: 2, sets: '7', reps: '5', pct: 0.75 },
    { dayIndex: 3, sets: '8', reps: '4', pct: 0.80 },
    { dayIndex: 4, sets: '9', reps: '3', pct: 0.85 },
  ];

  const completedMap = new Map();
  if (Array.isArray(completedDays)) {
    completedDays.forEach((c) => {
      if (c && typeof c.dayId === 'number') {
        completedMap.set(c.dayId, c.completedDate);
      }
    });
  }

  const days = [];

  for (let week = 1; week <= 3; week++) {
    const jumpMultiplier = week - 1; // 0 for Week 1, 1 for Week 2, 2 for Week 3
    const jumpAdded = jumpMultiplier * effectiveJump;

    baseConfig.forEach((cfg) => {
      const id = (week - 1) * 4 + cfg.dayIndex;
      let weight = 0;

      if (current1RM > 0) {
        // Base weight from percentage rounded cleanly
        const baseWeight = Math.round(current1RM * cfg.pct * 2) / 2;
        // Fixed progressive overload poundage/kg jump added to working weight
        weight = Math.round((baseWeight + jumpAdded) * 2) / 2;
      }

      const completedDate = completedMap.get(id) || '';

      days.push({
        id,
        week,
        weekDayNumber: cfg.dayIndex,
        day: `Day ${id}`,
        sets: cfg.sets,
        reps: cfg.reps,
        pct: Math.round(cfg.pct * 100),
        jumpAdded,
        weight,
        completedDate,
        isCompleted: Boolean(completedDate),
      });
    });
  }

  return days;
}
