/* =========================================================
   HABIT TRACKER - APP.JS
   COMPLETE STABLE VERSION
========================================================= */


/* =========================================================
   GLOBAL HELPERS
========================================================= */

function closeModalById(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}


/* =========================================================
   SEED DEFAULT HABITS
========================================================= */

function seedTestHabitsIfEmpty() {

  if (
    typeof Storage === "undefined" ||
    typeof Models === "undefined"
  ) {
    return;
  }

  const habits = Storage.getHabits();

  if (!Array.isArray(habits)) return;

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


/* =========================================================
   ADD HABIT BUTTON
========================================================= */

function addHabitButton() {

  const topbar = document.querySelector(".topbar");

  if (!topbar) return;

  if (document.getElementById("add-habit-button")) return;

  const button = document.createElement("button");

  button.id = "add-habit-button";
  button.type = "button";
  button.textContent = "+";
  button.title = "Add Habit";
  button.setAttribute("aria-label", "Add Habit");

  button.style.cssText = `
    background:#3B82F6;
    color:#FFFFFF;
    border:none;
    width:36px;
    height:36px;
    min-width:36px;
    min-height:36px;
    border-radius:50%;
    font-size:25px;
    line-height:34px;
    font-weight:400;
    cursor:pointer;
    margin-left:8px;
    padding:0;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    showAddHabitModal();
  });

  topbar.appendChild(button);
}


/* =========================================================
   STATS BUTTON
========================================================= */

function addStatsButton() {

  const topbar = document.querySelector(".topbar");

  if (!topbar) return;

  if (document.getElementById("stats-button")) return;

  const button = document.createElement("button");

  button.id = "stats-button";
  button.type = "button";
  button.textContent = "📊";
  button.title = "Statistics";
  button.setAttribute("aria-label", "Statistics");

  button.style.cssText = `
    background:#FFFFFF;
    color:#3B82F6;
    border:1px solid #D1D1D6;
    width:36px;
    height:36px;
    min-width:36px;
    min-height:36px;
    border-radius:50%;
    font-size:17px;
    cursor:pointer;
    margin-left:8px;
    padding:0;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    showStatsModal();
  });

  topbar.appendChild(button);
}


/* =========================================================
   SETTINGS BUTTON
========================================================= */

function addSettingsButton() {

  const topbar = document.querySelector(".topbar");

  if (!topbar) return;

  if (document.getElementById("settings-button")) return;

  const button = document.createElement("button");

  button.id = "settings-button";
  button.type = "button";
  button.textContent = "⚙️";
  button.title = "Settings";
  button.setAttribute("aria-label", "Settings");

  button.style.cssText = `
    background:#FFFFFF;
    color:#1C1C1E;
    border:1px solid #D1D1D6;
    width:36px;
    height:36px;
    min-width:36px;
    min-height:36px;
    border-radius:50%;
    font-size:17px;
    cursor:pointer;
    margin-left:8px;
    padding:0;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    showSettingsModal();
  });

  topbar.appendChild(button);
}


/* =========================================================
   ADD HABIT MODAL
========================================================= */

function showAddHabitModal() {

  closeModalById("habit-modal-overlay");

  const overlay = document.createElement("div");

  overlay.id = "habit-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:10000;
    box-sizing:border-box;
  `;

  const modal = document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:360px;
    max-height:90vh;
    overflow-y:auto;
    background:#FFFFFF;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    box-sizing:border-box;
  `;

  modal.innerHTML = `

    <h2 style="
      margin:0 0 20px;
      font-size:22px;
    ">
      Add Habit
    </h2>

    <label style="
      display:block;
      margin-bottom:6px;
      font-weight:600;
    ">
      Habit name
    </label>

    <input
      id="habit-name-input"
      type="text"
      placeholder="e.g. Study"
      autocomplete="off"
      style="
        width:100%;
        padding:12px;
        border:1px solid #D1D1D6;
        border-radius:10px;
        font-size:16px;
        margin-bottom:16px;
        box-sizing:border-box;
      "
    />

    <label style="
      display:block;
      margin-bottom:6px;
      font-weight:600;
    ">
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
        box-sizing:border-box;
      "
    />

    <label style="
      display:block;
      margin-bottom:6px;
      font-weight:600;
    ">
      Color
    </label>

    <div style="
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:16px;
    ">

      <input
        id="habit-color-input"
        type="color"
        value="#3B82F6"
        style="
          width:58px;
          height:42px;
          padding:2px;
          border:1px solid #D1D1D6;
          border-radius:10px;
          background:white;
        "
      />

      <span
        id="habit-color-value"
        style="
          font-size:15px;
          color:#8E8E93;
        "
      >
        #3B82F6
      </span>

    </div>

    <label style="
      display:block;
      margin-bottom:6px;
      font-weight:600;
    ">
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
        box-sizing:border-box;
      "
    />

    <div style="
      display:flex;
      gap:10px;
    ">

      <button
        id="cancel-habit-button"
        type="button"
        style="
          flex:1;
          padding:12px;
          border:none;
          border-radius:12px;
          background:#E5E5EA;
          color:#1C1C1E;
          font-size:16px;
        "
      >
        Cancel
      </button>

      <button
        id="save-habit-button"
        type="button"
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

  const colorInput =
    document.getElementById("habit-color-input");

  const colorValue =
    document.getElementById("habit-color-value");

  if (colorInput && colorValue) {

    colorInput.addEventListener("input", function() {
      colorValue.textContent = colorInput.value;
    });

  }

  document
    .getElementById("cancel-habit-button")
    .addEventListener("click", function() {
      overlay.remove();
    });

  document
    .getElementById("save-habit-button")
    .addEventListener("click", function() {

      const name =
        document
          .getElementById("habit-name-input")
          .value
          .trim();

      const icon =
        document
          .getElementById("habit-icon-input")
          .value
          .trim() || "✅";

      const color =
        document
          .getElementById("habit-color-input")
          .value;

      const goal =
        Number(
          document
            .getElementById("habit-goal-input")
            .value
        );

      if (!name) {
        alert("Please enter a habit name.");
        return;
      }

      if (!goal || goal < 1 || goal > 31) {
        alert("Monthly goal must be between 1 and 31.");
        return;
      }

      if (
        typeof Storage === "undefined" ||
        typeof Models === "undefined"
      ) {
        alert("Storage system is not available.");
        return;
      }

      const habits = Storage.getHabits();

      Storage.addHabit(
        Models.createHabit({
          name: name,
          icon: icon,
          color: color,
          monthlyGoal: goal,
          sortOrder: habits.length
        })
      );

      overlay.remove();

      safeRender();

    });

  overlay.addEventListener("click", function(event) {

    if (event.target === overlay) {
      overlay.remove();
    }

  });

  setTimeout(function() {

    const input =
      document.getElementById("habit-name-input");

    if (input) input.focus();

  }, 100);
}


/* =========================================================
   BEST STREAK
========================================================= */

function calculateHabitBestStreak(habitId) {

  if (typeof Storage === "undefined") return 0;

  const completions =
    Storage.getCompletions()
      .filter(function(completion) {
        return completion.habitId === habitId;
      });

  if (completions.length === 0) return 0;

  const dates = [
    ...new Set(
      completions.map(function(completion) {
        return completion.dateKey;
      })
    )
  ].sort();

  if (dates.length === 0) return 0;

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {

    const previousDate =
      new Date(dates[i - 1] + "T00:00:00");

    const currentDate =
      new Date(dates[i] + "T00:00:00");

    const difference =
      Math.round(
        (currentDate - previousDate) /
        (1000 * 60 * 60 * 24)
      );

    if (difference === 1) {

      currentStreak++;

      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }

    } else {

      currentStreak = 1;

    }
  }

  return bestStreak;
}


/* =========================================================
   CURRENT STREAK
========================================================= */

function calculateHabitCurrentStreak(habitId) {

  if (typeof Storage === "undefined") return 0;

  const completions =
    Storage.getCompletions()
      .filter(function(completion) {
        return completion.habitId === habitId;
      });

  if (completions.length === 0) return 0;

  const dates = [
    ...new Set(
      completions.map(function(completion) {
        return completion.dateKey;
      })
    )
  ].sort().reverse();

  if (dates.length === 0) return 0;

  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {

    const currentDate =
      new Date(dates[i] + "T00:00:00");

    const previousDate =
      new Date(dates[i + 1] + "T00:00:00");

    const difference =
      Math.round(
        (currentDate - previousDate) /
        (1000 * 60 * 60 * 24)
      );

    if (difference === 1) {

      streak++;

    } else {

      break;

    }
  }

  return streak;
}


/* =========================================================
   STATISTICS MODAL
========================================================= */

function showStatsModal() {

  closeModalById("stats-modal-overlay");

  if (
    typeof Storage === "undefined" ||
    typeof Grid === "undefined"
  ) {
    alert("Statistics are temporarily unavailable.");
    return;
  }

  const habits = Storage.getHabits();
  const completions = Storage.getCompletions();

  const year = Grid.currentYear;
  const month = Grid.currentMonth;

  const monthPrefix =
    `${year}-${String(month).padStart(2, "0")}`;

  const monthCompletions =
    completions.filter(function(completion) {
      return completion.dateKey.startsWith(monthPrefix);
    });

  const daysInMonth =
    DateHelpers.daysInMonth(year, month);

  const totalCompletions =
    monthCompletions.length;

  const possibleCompletions =
    habits.length * daysInMonth;

  const overallPercent =
    possibleCompletions > 0
      ? Math.round(
          (totalCompletions / possibleCompletions) * 100
        )
      : 0;

  const overlay = document.createElement("div");

  overlay.id = "stats-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:11000;
    box-sizing:border-box;
  `;

  const modal = document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:390px;
    max-height:85vh;
    overflow-y:auto;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    box-sizing:border-box;
  `;

  let habitStatsHTML = "";

  habits.forEach(function(habit) {

    const habitCompletions =
      monthCompletions.filter(function(completion) {
        return completion.habitId === habit.id;
      }).length;

    const goal =
      habit.monthlyGoal || daysInMonth;

    const percent =
      Math.min(
        100,
        Math.round((habitCompletions / goal) * 100)
      );

    const currentStreak =
      calculateHabitCurrentStreak(habit.id);

    const bestStreak =
      calculateHabitBestStreak(habit.id);

    habitStatsHTML += `

      <div style="
        background:#F2F2F7;
        border-radius:16px;
        padding:15px;
        margin-bottom:12px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:12px;
        ">

          <div style="
            display:flex;
            align-items:center;
            gap:8px;
            font-size:17px;
            font-weight:600;
            min-width:0;
          ">

            <span>
              ${habit.icon || "✅"}
            </span>

            <span style="
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            ">
              ${habit.name}
            </span>

          </div>

          <span style="
            font-weight:600;
            color:${habit.color || "#3B82F6"};
          ">
            ${percent}%
          </span>

        </div>

        <div style="
          height:8px;
          background:#E5E5EA;
          border-radius:10px;
          overflow:hidden;
          margin-bottom:12px;
        ">

          <div style="
            width:${percent}%;
            height:100%;
            background:${habit.color || "#3B82F6"};
            border-radius:10px;
          "></div>

        </div>

        <div style="
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          text-align:center;
        ">

          <div>
            <div style="
              font-size:18px;
              font-weight:600;
            ">
              ${habitCompletions}
            </div>

            <div style="
              font-size:12px;
              color:#8E8E93;
            ">
              This month
            </div>
          </div>

          <div>
            <div style="
              font-size:18px;
              font-weight:600;
            ">
              ${currentStreak} 🔥
            </div>

            <div style="
              font-size:12px;
              color:#8E8E93;
            ">
              Current
            </div>
          </div>

          <div>
            <div style="
              font-size:18px;
              font-weight:600;
            ">
              ${bestStreak} 🏆
            </div>

            <div style="
              font-size:12px;
              color:#8E8E93;
            ">
              Best
            </div>
          </div>

        </div>

      </div>
    `;
  });

  modal.innerHTML = `

    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:20px;
    ">

      <h2 style="
        margin:0;
        font-size:24px;
      ">
        📊 Statistics
      </h2>

      <button
        id="close-stats-button"
        type="button"
        style="
          border:none;
          background:#E5E5EA;
          width:34px;
          height:34px;
          border-radius:50%;
          font-size:20px;
        "
      >
        ×
      </button>

    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
      margin-bottom:20px;
    ">

      <div style="
        background:#F2F2F7;
        border-radius:16px;
        padding:16px;
        text-align:center;
      ">

        <div style="
          font-size:28px;
          font-weight:700;
        ">
          ${overallPercent}%
        </div>

        <div style="
          color:#8E8E93;
          font-size:14px;
        ">
          Monthly
        </div>

      </div>

      <div style="
        background:#F2F2F7;
        border-radius:16px;
        padding:16px;
        text-align:center;
      ">

        <div style="
          font-size:28px;
          font-weight:700;
        ">
          ${totalCompletions}
        </div>

        <div style="
          color:#8E8E93;
          font-size:14px;
        ">
          Completions
        </div>

      </div>

    </div>

    <h3 style="
      margin:0 0 12px;
      font-size:18px;
    ">
      Habit Statistics
    </h3>

    ${
      habitStatsHTML ||
      `
        <div style="
          text-align:center;
          padding:25px;
          color:#8E8E93;
        ">
          No habits yet.
        </div>
      `
    }

    <button
      id="stats-done-button"
      type="button"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#3B82F6;
        color:white;
        font-size:16px;
        font-weight:600;
      "
    >
      Done
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("close-stats-button")
    .addEventListener("click", function() {
      overlay.remove();
    });

  document
    .getElementById("stats-done-button")
    .addEventListener("click", function() {
      overlay.remove();
    });

  overlay.addEventListener("click", function(event) {

    if (event.target === overlay) {
      overlay.remove();
    }

  });
}


/* =========================================================
   SETTINGS MODAL
========================================================= */

function showSettingsModal() {

  closeModalById("settings-modal-overlay");

  const overlay = document.createElement("div");

  overlay.id = "settings-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:12000;
    box-sizing:border-box;
  `;

  const modal = document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:360px;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    box-sizing:border-box;
  `;

  modal.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:22px;
    ">

      <h2 style="
        margin:0;
        font-size:23px;
      ">
        ⚙️ Settings
      </h2>

      <button
        id="close-settings"
        type="button"
        style="
          border:none;
          background:#E5E5EA;
          width:34px;
          height:34px;
          border-radius:50%;
          font-size:20px;
        "
      >
        ×
      </button>

    </div>

    <div style="
      background:#F2F2F7;
      border-radius:14px;
      padding:15px;
      margin-bottom:12px;
    ">

      <div style="
        font-size:16px;
        font-weight:600;
        margin-bottom:5px;
      ">
        Habit Tracker
      </div>

      <div style="
        color:#8E8E93;
        font-size:14px;
      ">
        Manage your habits and progress.
      </div>

    </div>

    <button
      id="reset-data-button"
      type="button"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#FF3B30;
        color:white;
        font-size:16px;
        font-weight:600;
        margin-bottom:10px;
      "
    >
      Reset All Data
    </button>

    <button
      id="settings-close-button"
      type="button"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#3B82F6;
        color:white;
        font-size:16px;
        font-weight:600;
      "
    >
      Done
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("close-settings")
    .addEventListener("click", function() {
      overlay.remove();
    });

  document
    .getElementById("settings-close-button")
    .addEventListener("click", function() {
      overlay.remove();
    });

  document
    .getElementById("reset-data-button")
    .addEventListener("click", function() {

      const confirmed =
        confirm(
          "Delete all habits and completions?"
        );

      if (!confirmed) return;

      localStorage.clear();

      overlay.remove();

      location.reload();

    });

  overlay.addEventListener("click", function(event) {

    if (event.target === overlay) {
      overlay.remove();
    }

  });
}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  if (
    typeof Storage === "undefined" ||
    typeof Grid === "undefined" ||
    typeof DateHelpers === "undefined"
  ) {
    return;
  }

  const habits = Storage.getHabits();
  const completions = Storage.getCompletions();

  const year = Grid.currentYear;
  const month = Grid.currentMonth;

  const monthPrefix =
    `${year}-${String(month).padStart(2, "0")}`;

  const monthCompletions =
    completions.filter(function(completion) {
      return completion.dateKey.startsWith(monthPrefix);
    });

  const daysInMonth =
    DateHelpers.daysInMonth(year, month);

  const totalCompletions =
    monthCompletions.length;

  const possibleCompletions =
    habits.length * daysInMonth;

  const overallPercent =
    possibleCompletions > 0
      ? Math.round(
          (totalCompletions / possibleCompletions) * 100
        )
      : 0;

  let bestStreak = 0;

  habits.forEach(function(habit) {

    const streak =
      calculateHabitBestStreak(habit.id);

    if (streak > bestStreak) {
      bestStreak = streak;
    }

  });

  const percentElement =
    document.getElementById("overall-percent");

  const totalElement =
    document.getElementById("total-completions");

  const streakElement =
    document.getElementById("best-streak");

  if (percentElement) {
    percentElement.textContent =
      `${overallPercent}%`;
  }

  if (totalElement) {
    totalElement.textContent =
      totalCompletions;
  }

  if (streakElement) {
    streakElement.textContent =
      `${bestStreak} 🔥`;
  }

  const progressContainer =
    document.getElementById("habit-progress");

  if (!progressContainer) return;

  progressContainer.innerHTML = "";

  const sortedHabits =
    [...habits].sort(function(a, b) {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

  sortedHabits.forEach(function(habit) {

    const habitCompletions =
      monthCompletions.filter(function(completion) {
        return completion.habitId === habit.id;
      }).length;

    const goal =
      habit.monthlyGoal || daysInMonth;

    const percent =
      Math.min(
        100,
        Math.round((habitCompletions / goal) * 100)
      );

    const currentStreak =
      calculateHabitCurrentStreak(habit.id);

    const bestHabitStreak =
      calculateHabitBestStreak(habit.id);

    const card =
      document.createElement("div");

    card.className = "progress-card";

    card.innerHTML = `

      <div class="progress-header">

        <div class="progress-name">

          <span>
            ${habit.icon || "✅"}
          </span>

          <span>
            ${habit.name}
          </span>

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
            background:${habit.color || "#3B82F6"};
          "
        ></div>

      </div>

      <div class="progress-footer">

        <span>
          ${percent}% complete
        </span>

        <span>
          🔥 ${currentStreak}
          &nbsp; • &nbsp;
          🏆 ${bestHabitStreak}
        </span>

      </div>
    `;

    progressContainer.appendChild(card);

  });
}


/* =========================================================
   SAFE GRID RENDER
========================================================= */

function safeRender() {

  try {

    if (
      typeof Grid !== "undefined" &&
      typeof Grid.render === "function"
    ) {
      Grid.render();
    }

  } catch (error) {

    console.error(
      "Grid render error:",
      error
    );

  }

  try {

    updateDashboard();

  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }
}


/* =========================================================
   MONTH NAVIGATION
========================================================= */

function setupMonthNavigation() {

  const previousButton =
    document.getElementById("prev-month");

  const nextButton =
    document.getElementById("next-month");

  if (previousButton) {

    previousButton.type = "button";

    previousButton.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        try {

          if (
            typeof Grid !== "undefined" &&
            typeof Grid.goToPrevMonth === "function"
          ) {

            Grid.goToPrevMonth();

          } else {

            if (typeof Grid !== "undefined") {

              Grid.currentMonth--;

              if (Grid.currentMonth < 1) {
                Grid.currentMonth = 12;
                Grid.currentYear--;
              }

              safeRender();

            }

          }

        } catch (error) {

          console.error(
            "Previous month error:",
            error
          );

        }

      }
    );

  }

  if (nextButton) {

    nextButton.type = "button";

    nextButton.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        try {

          if (
            typeof Grid !== "undefined" &&
            typeof Grid.goToNextMonth === "function"
          ) {

            Grid.goToNextMonth();

          } else {

            if (typeof Grid !== "undefined") {

              Grid.currentMonth++;

              if (Grid.currentMonth > 12) {
                Grid.currentMonth = 1;
                Grid.currentYear++;
              }

              safeRender();

            }

          }

        } catch (error) {

          console.error(
            "Next month error:",
            error
          );

        }

      }
    );

  }
}


/* =========================================================
   START APPLICATION
========================================================= */

function startHabitTracker() {

  /*
     IMPORTANT:
     Create buttons BEFORE Grid.render().
     If Grid has an error, the buttons still exist.
  */

  addStatsButton();
  addSettingsButton();
  addHabitButton();

  setupMonthNavigation();

  try {
    seedTestHabitsIfEmpty();
  } catch (error) {
    console.error(
      "Seed error:",
      error
    );
  }

  safeRender();
}


/* =========================================================
   DOM READY
========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startHabitTracker
  );

} else {

  startHabitTracker();

}
