const Grid = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  render() {
    document.getElementById("month-title").textContent =
      DateHelpers.monthName(this.currentYear, this.currentMonth);

    const habits = Storage.getHabits();
    const gridEl = document.getElementById("grid");
    gridEl.innerHTML = "";

    if (habits.length === 0) {
      gridEl.innerHTML =
        `<div class="empty-state">No habits yet. Add one to get started!</div>`;
      return;
    }

    const daysCount = DateHelpers.daysInMonth(
      this.currentYear,
      this.currentMonth
    );

    const headerRow = document.createElement("div");
    headerRow.className = "grid-header-row";

    const cornerCell = document.createElement("div");
    cornerCell.className = "habit-name-cell";
    headerRow.appendChild(cornerCell);

    for (let day = 1; day <= daysCount; day++) {
      const dateKey = DateHelpers.dateKeyFor(
        this.currentYear,
        this.currentMonth,
        day
      );

      const isToday = DateHelpers.isToday(dateKey);

      const cell = document.createElement("div");
      cell.className =
        "day-header-cell" + (isToday ? " today" : "");

      cell.innerHTML =
        `${day}<br>${DateHelpers.weekdayLetter(
          this.currentYear,
          this.currentMonth,
          day
        )}`;

      headerRow.appendChild(cell);
    }

    gridEl.appendChild(headerRow);

    const sortedHabits = [...habits].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    sortedHabits.forEach(habit => {
      const row = document.createElement("div");
      row.className = "grid-row";

      const nameCell = document.createElement("div");
      nameCell.className = "habit-name-cell";

      nameCell.innerHTML =
        `<span class="icon">${habit.icon}</span>${habit.name}`;

      row.appendChild(nameCell);

      for (let day = 1; day <= daysCount; day++) {
        const dateKey = DateHelpers.dateKeyFor(
          this.currentYear,
          this.currentMonth,
          day
        );

        const isToday = DateHelpers.isToday(dateKey);
        const completed = Storage.isCompleted(
          habit.id,
          dateKey
        );

        const cell = document.createElement("div");
        cell.className =
          "day-cell" + (isToday ? " is-today" : "");

        const inner = document.createElement("div");
        inner.className =
          "day-cell-inner" +
          (completed ? " completed" : "");

        inner.style.setProperty(
          "--habit-color",
          habit.color
        );

        inner.addEventListener("click", () => {
          Storage.toggleCompletion(habit.id, dateKey);
          this.render();
        });

        cell.appendChild(inner);
        row.appendChild(cell);
      }

      gridEl.appendChild(row);
    });
  },

  goToPrevMonth() {
    this.currentMonth--;

    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear--;
    }

    this.render();
  },

  goToNextMonth() {
    this.currentMonth++;

    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }

    this.render();
  }
};
