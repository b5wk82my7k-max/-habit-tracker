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

function addHabitButton() {
  const topbar = document.querySelector(".topbar");

  const button = document.createElement("button");
  button.id = "add-habit-button";
  button.textContent = "+";
  button.title = "Add Habit";

  button.style.cssText = `
    background: #3B82F6;
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 25px;
    line-height: 36px;
    font-weight: 400;
    cursor: pointer;
  `;

  button.addEventListener("click", showAddHabitModal);

  topbar.appendChild(button);
}

function showAddHabitModal() {
  const overlay = document.createElement("div");
  overlay.id = "habit-modal-overlay";

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
  `;

  const modal = document.createElement("div");

  modal.style.cssText = `
    width: 100%;
    max-width: 360px;
    background: white;
    color: #1C1C1E;
    border-radius: 20px;
    padding: 22px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  `;

  modal.innerHTML = `
    <h2 style="margin:0 0 20px;font-size:22px;">
      Add Habit
    </h2>

    <label style="display:block;margin-bottom:6px;font-weight:600;">
      Habit name
    </label>

    <input
      id="habit-name-input"
      type="text"
      placeholder="e.g. Study"
      style="
        width:100%;
        padding:12px;
        border:1px solid #D1D1D6;
        border-radius:10px;
        font-size:16px;
        margin-bottom:16px;
      "
    />

    <label style="display:block;margin-bottom:6px;font-weight:600;">
      Icon
    </label>

    <input
      id="habit-icon-input"
      type="text"
      value="✅"
      maxlength="2"
      style="
        width:100%;
        padding:12px;
        border:1px solid #D1D1D6;
        border-radius:10px;
        font-size:20px;
        margin-bottom:16px;
      "
    />

    <label style="display:block;margin-bottom:6px;font-weight:600;">
      Monthly goal
    </label>

    <input
      id="habit-goal-input"
      type="number"
      value="20"
      min="1"
      max="31"
      style="
        width:100%;
        padding:12px;
        border:1px solid #D1D1D6;
        border-radius:10px;
        font-size:16px;
        margin-bottom:20px;
      "
    />

    <div style="display:flex;gap:10px;">
      <button
        id="cancel-habit-button"
        style="
          flex:1;
          padding:12px;
          border:none;
          border-radius:12px;
          background:#E5E5EA;
          font-size:16px;
        "
      >
        Cancel
      </button>

      <button
        id="save-habit-button"
        style="
          flex:1;
          padding:12px;
          border:none;
          border-radius:12px;
          background:#3B82F6;
          color:white;
          font-size:16px;
          font-weight:600;
        "
      >
        Add
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("cancel-habit-button")
    .addEventListener("click", () => overlay.remove());

  document
    .getElementById("save-habit-button")
    .addEventListener("click", () => {
      const name = document
        .getElementById("habit-name-input")
        .value
        .trim();

      const icon =
        document.getElementById("habit-icon-input").value.trim() || "✅";

      const goal = Number(
        document.getElementById("habit-goal-input").value
      );

      if (!name) {
        alert("Please enter a habit name.");
        return;
      }

      const habits = Storage.getHabits();

      Storage.addHabit(
        Models.createHabit({
          name,
          icon,
          color: "#3B82F6",
          monthlyGoal: goal || 20,
          sortOrder: habits.length
        })
      );

      overlay.remove();
      Grid.render();
    });
}

document
  .getElementById("prev-month")
  .addEventListener("click", () => Grid.goToPrevMonth());

document
  .getElementById("next-month")
  .addEventListener("click", () => Grid.goToNextMonth());

function updateDashboard() {
  seedTestHabitsIfEmpty();
addHabitButton();
Grid.render();
updateDashboard();
  const habits = Storage.getHabits();
  const completions = Storage.getCompletions();

  const year = Grid.currentYear;
  const month = Grid.currentMonth;

  const monthPrefix =
    `${year}-${String(month).padStart(2, "0")}`;

  const monthCompletions = completions.filter(
    completion => completion.dateKey.startsWith(monthPrefix)
  );

  const totalCompletions = monthCompletions.length;

  const daysInMonth =
    DateHelpers.daysInMonth(year, month);

  const possibleCompletions =
    habits.length * daysInMonth;

  const overallPercent =
    possibleCompletions > 0
      ? Math.round(
          (totalCompletions / possibleCompletions) * 100
        )
      : 0;

  document.getElementById("overall-percent").textContent =
    `${overallPercent}%`;

  document.getElementById("total-completions").textContent =
    totalCompletions;

  const progressContainer =
    document.getElementById("habit-progress");

  progressContainer.innerHTML = "";

  habits.forEach(habit => {
    const habitCompletions = monthCompletions.filter(
      completion => completion.habitId === habit.id
    ).length;

    const goal = habit.monthlyGoal || daysInMonth;

    const percent = Math.min(
      100,
      Math.round((habitCompletions / goal) * 100)
    );

    const card = document.createElement("div");
    card.className = "progress-card";

    card.innerHTML = `
      <div class="progress-header">

        <div class="progress-name">
          <span>${habit.icon}</span>
          <span>${habit.name}</span>
        </div>

        <div class="progress-number">
          ${habitCompletions}/${goal}
        </div>

      </div>

      <div class="progress-track">
        <div
          class="progress-fill"
          style="
            width:${percent}%;
            background:${habit.color};
          "
        ></div>
      </div>

      <div class="progress-footer">
        <span>Monthly goal</span>
        <span class="progress-percent">
          ${percent}%
        </span>
      </div>
    `;

    progressContainer.appendChild(card);
  });
}
