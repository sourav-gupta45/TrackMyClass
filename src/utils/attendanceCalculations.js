/**
 * Attendance calculation utilities and "What-If" bunk simulations
 */

export const MIN_REQUIRED_PERCENTAGE = 75;

export function calculatePercentage(attended, total) {
  if (!total || total === 0) return 100;
  return Number(((attended / total) * 100).toFixed(1));
}

/**
 * If percentage < 75%, how many consecutive classes must be attended to reach 75%?
 * (attended + x) / (total + x) >= 0.75
 * 4 * attended + 4x >= 3 * total + 3x
 * x >= 3 * total - 4 * attended
 */
export function getClassesNeededFor75(attended, total) {
  if (total === 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct >= MIN_REQUIRED_PERCENTAGE) return 0;
  const needed = Math.ceil(3 * total - 4 * attended);
  return Math.max(0, needed);
}

/**
 * If percentage >= 75%, how many classes can be safely missed before dropping below 75%?
 * attended / (total + y) >= 0.75
 * 4 * attended >= 3 * total + 3y
 * 3y <= 4 * attended - 3 * total
 * y <= (4 * attended - 3 * total) / 3
 */
export function getSafeBunks(attended, total) {
  if (total === 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct < MIN_REQUIRED_PERCENTAGE) return 0;
  const bunks = Math.floor((4 * attended - 3 * total) / 3);
  return Math.max(0, bunks);
}

/**
 * Simulate the effect of missing upcoming classes for a single subject
 * @param {number} currentAttended
 * @param {number} currentTotal
 * @param {number} missedCount - number of classes to be missed
 */
export function simulateMissedClasses(currentAttended, currentTotal, missedCount = 1) {
  const currentPct = calculatePercentage(currentAttended, currentTotal);
  const projectedTotal = currentTotal + missedCount;
  const projectedAttended = currentAttended;
  const projectedPct = calculatePercentage(projectedAttended, projectedTotal);
  const difference = Number((currentPct - projectedPct).toFixed(1));
  const isSafe = projectedPct >= MIN_REQUIRED_PERCENTAGE;
  const recoveryClasses = isSafe ? 0 : getClassesNeededFor75(projectedAttended, projectedTotal);
  const remainingSafeBunks = isSafe ? getSafeBunks(projectedAttended, projectedTotal) : 0;

  return {
    currentAttended,
    currentTotal,
    currentPct,
    projectedAttended,
    projectedTotal,
    projectedPct,
    difference,
    isSafe,
    recoveryClasses,
    remainingSafeBunks
  };
}

/**
 * Format date string to YYYY-MM-DD
 */
export function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}
