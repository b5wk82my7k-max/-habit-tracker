function seedTestHabitsIfEmpty() {
  const habits = Storage.getHabits();

  if (habits.length === 0) {
    Storage.addHabit(
      Models.createHabit({
        name: "Drink Water",
        icon: "💧",
        color: "#3B82F6",
        monthlyGoal: 20,
        sortOrder: 0
      })
    );

    Storage.addHabit(
      Models.createHabit({
        name: "Read",
        icon: "📖",
        color: "#34C759",
        monthlyGoal: 15,
        sortOrder: 1
      })
    );

    Storage.addHabit(
      Models.createHabit({
        name: "Workout",
        icon: "💪",
        color: "#FF9500",
        monthlyGoal: 12,
        sortOrder: 2
      })
    );
  }
}

document
  .getElementById("prev-month")
  .addEventListener("click", () => Grid.goToPrevMonth());

document
  .getElementById("next-month")
  .addEventListener("click", () => Grid.goToNextMonth());

seedTestHabitsIfEmpty();
Grid.render();
