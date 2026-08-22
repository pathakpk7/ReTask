/**
 * Productivity Intelligence & Analytics Calculation Engine
 */

/**
 * Calculates current and longest completion streaks based on task completion dates.
 */
export function calculateStreakMetrics(tasks, historyArray = []) {
  if (!tasks || tasks.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      weeklyConsistency: 0,
    };
  }

  // Extract set of unique YYYY-MM-DD completion dates
  const completionDates = new Set();
  tasks.forEach((t) => {
    if (t.completed && t.completedAt) {
      const dateStr = t.completedAt.split('T')[0];
      completionDates.add(dateStr);
    }
  });

  historyArray.forEach((h) => {
    if (h.completedCount > 0) {
      completionDates.add(h.date);
    }
  });

  const sortedDates = Array.from(completionDates).sort((a, b) => new Date(a) - new Date(b));
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDays: 0, weeklyConsistency: 0 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  // Calculate streaks sequentially
  sortedDates.forEach((dateStr) => {
    const curr = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = curr - prevDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = curr;
  });

  // Current streak check: must include today or yesterday
  const hasCompletedToday = completionDates.has(todayStr);
  const hasCompletedYesterday = completionDates.has(yesterdayStr);

  if (hasCompletedToday || hasCompletedYesterday) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  // Weekly consistency (% of last 7 days with activity)
  let last7Active = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() - 86400000 * i).toISOString().split('T')[0];
    if (completionDates.has(d)) last7Active++;
  }
  const weeklyConsistency = Math.round((last7Active / 7) * 100);

  return {
    currentStreak,
    longestStreak,
    activeDays: sortedDates.length,
    weeklyConsistency,
  };
}

/**
 * Behavioral Avoidance Classifier: Detects tasks repeatedly carried forward or postponed.
 */
export function classifyAvoidanceRisk(tasks) {
  const activeTasks = tasks.filter((t) => !t.completed);

  return activeTasks
    .map((task) => {
      const carryCount = task.carryForwardCount || 0;
      const createdDate = task.createdAt ? new Date(task.createdAt) : new Date();
      const ageInDays = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));

      let riskLevel = 'LOW';
      let score = 0; // 0 to 100
      let recommendations = [];

      if (carryCount >= 3) {
        riskLevel = 'HIGH';
        score = 85 + Math.min(15, carryCount);
        recommendations.push('Repeatedly carried forward 3+ times. Decompose into smaller subtasks.');
      } else if (carryCount >= 1 || ageInDays > 7) {
        riskLevel = 'MODERATE';
        score = 40 + carryCount * 15 + Math.min(20, ageInDays);
        recommendations.push('Task carried forward or pending over 7 days. Re-evaluate scope or time estimate.');
      } else {
        riskLevel = 'LOW';
        score = Math.min(30, ageInDays * 2);
        recommendations.push('Task execution progressing normally.');
      }

      return {
        task,
        riskLevel,
        score,
        carryCount,
        ageInDays,
        recommendations,
      };
    })
    .filter((item) => item.riskLevel !== 'LOW') // Show moderate & high risk items
    .sort((a, b) => b.score - a.score);
}

/**
 * Estimation & Difficulty Correlation Analytics.
 */
export function calculateEstimationMetrics(tasks) {
  const completedWithEst = tasks.filter((t) => t.completed && t.estimatedTime > 0);
  if (completedWithEst.length === 0) {
    return { hasData: false, totalEstimatedHours: 0, avgEstimateMinutes: 0 };
  }

  const totalMinutes = completedWithEst.reduce((sum, t) => sum + t.estimatedTime, 0);
  const avgMinutes = Math.round(totalMinutes / completedWithEst.length);

  return {
    hasData: true,
    totalEstimatedHours: (totalMinutes / 60).toFixed(1),
    avgEstimateMinutes: avgMinutes,
    sampleCount: completedWithEst.length,
  };
}
