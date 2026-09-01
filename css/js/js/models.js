const Models = {
  createHabit({
    name,
    icon = "✅",
    color = "#3B82F6",
    monthlyGoal = 20,
    sortOrder = 0
  }) {
    return {
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      monthlyGoal,
      createdAt: new Date().toISOString(),
      sortOrder
    };
  },

  createCompletion({ habitId, dateKey }) {
    return {
      id: crypto.randomUUID(),
      habitId,
      dateKey
    };
  }
};
