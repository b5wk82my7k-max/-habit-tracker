const STORAGE_KEYS = {
  habits: "habitTracker.habits",
  completions: "habitTracker.completions"
};

const Storage = {
  getHabits() {
    const raw = localStorage.getItem(STORAGE_KEYS.habits);
    return raw ? JSON.parse(raw) : [];
  },

  saveHabits(habits) {
    localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
  },

  getCompletions() {
    const raw = localStorage.getItem(STORAGE_KEYS.completions);
    return raw ? JSON.parse(raw) : [];
  },

  saveCompletions(completions) {
    localStorage.setItem(
      STORAGE_KEYS.completions,
      JSON.stringify(completions)
    );
  },

  addHabit(habit) {
    const habits = this.getHabits();
    habits.push(habit);
    this.saveHabits(habits);
    return habit;
  },

  toggleCompletion(habitId, dateKey) {
    const completions = this.getCompletions();

    const index = completions.findIndex(
      c => c.habitId === habitId && c.dateKey === dateKey
    );

    if (index >= 0) {
      completions.splice(index, 1);
    } else {
      completions.push(
        Models.createCompletion({
          habitId,
          dateKey
        })
      );
    }

    this.saveCompletions(completions);
  },

  isCompleted(habitId, dateKey) {
    const completions = this.getCompletions();

    return completions.some(
      c => c.habitId === habitId && c.dateKey === dateKey
    );
  }
};
