/* =========================================================
   HABIT TRACKER - APP.JS
   STABLE VERSION
========================================================= */


/* =========================================================
   SEED DEFAULT HABITS
========================================================= */

function seedTestHabitsIfEmpty() {

  const habits = Storage.getHabits();

  if (habits.length > 0) return;

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


/* =========================================================
   CREATE TOP BUTTON
========================================================= */

function createTopButton(id, text, title, background, color, clickHandler) {

  const topbar = document.querySelector(".topbar");

  if (!topbar) {
    console.error("Topbar not found");
    return;
  }

  const oldButton = document.getElementById(id);

  if (oldButton) {
    oldButton.remove();
  }

  const button = document.createElement("button");

  button.id = id;
  button.type = "button";
  button.textContent = text;
  button.title = title;

  button.style.cssText = `
    width:36px;
    height:36px;
    min-width:36px;
    padding:0;
    margin-left:8px;
    border-radius:50%;
    border:1px solid #D1D1D6;
    background:${background};
    color:${color};
    font-size:18px;
    line-height:36px;
    text-align:center;
    cursor:pointer;
    -webkit-appearance:none;
    appearance:none;
    touch-action:manipulation;
  `;

  button.addEventListener("click", function(event) {

    event.preventDefault();
    event.stopPropagation();

    clickHandler();

  });

  topbar.appendChild(button);
}


/* =========================================================
   ADD HABIT BUTTON
========================================================= */

function addHabitButton() {

  createTopButton(
    "add-habit-button",
    "+",
    "Add Habit",
    "#3B82F6",
    "#FFFFFF",
    showAddHabitModal
  );

}


/* =========================================================
   STATISTICS BUTTON
========================================================= */

function addStatsButton() {

  createTopButton(
    "stats-button",
    "📊",
    "Statistics",
    "#FFFFFF",
    "#3B82F6",
    showStatsModal
  );

}


/* =========================================================
   SETTINGS BUTTON
========================================================= */

function addSettingsButton() {

  createTopButton(
    "settings-button",
    "⚙️",
    "Settings",
    "#FFFFFF",
    "#1C1C1E",
    showSettingsModal
  );

}


/* =========================================================
   ADD HABIT MODAL
========================================================= */

function showAddHabitModal() {

  closeExistingModals();

  const overlay = document.createElement("div");

  overlay.id = "habit-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:9999;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
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
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
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
        box-sizing:border-box;
      "
    />

    <label style="display:block;margin-bottom:6px;font-weight:600;">
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
        style="font-size:14px;color:#8E8E93;"
      >
        #3B82F6
      </span>

    </div>

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
        box-sizing:border-box;
      "
    />

    <div style="display:flex;gap:10px;">

      <button
        id="cancel-habit-button"
        type="button"
        style="
          flex:1;
          padding:13px;
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
          padding:13px;
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

  colorInput.addEventListener("input", function() {

    colorValue.textContent =
      colorInput.value.toUpperCase();

  });


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


      if (!Number.isInteger(goal) || goal < 1 || goal > 31) {

        alert("Monthly goal must be between 1 and 31.");

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

      Grid.render();

      updateDashboard();

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

  }, 50);

}


/* =========================================================
   BEST STREAK
========================================================= */

function calculateHabitBestStreak(habitId) {

  const completions =
    Storage.getCompletions().filter(function(completion) {

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


  let best = 1;
  let current = 1;


  for (let i = 1; i < dates.length; i++) {

    const previous =
      new Date(dates[i - 1] + "T00:00:00");

    const currentDate =
      new Date(dates[i] + "T00:00:00");


    const difference =
      Math.round(
        (currentDate - previous) /
        (1000 * 60 * 60 * 24)
      );


    if (difference === 1) {

      current++;

      if (current > best) {
        best = current;
      }

    } else {

      current = 1;

    }

  }


  return best;
}


/* =========================================================
   CURRENT STREAK
========================================================= */

function calculateHabitCurrentStreak(habitId) {

  const completions =
    Storage.getCompletions().filter(function(completion) {

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


  let streak = 1;


  for (let i = 0; i < dates.length - 1; i++) {

    const current =
      new Date(dates[i] + "T00:00:00");

    const previous =
      new Date(dates[i + 1] + "T00:00:00");


    const difference =
      Math.round(
        (current - previous) /
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
   STATISTICS
========================================================= */

function showStatsModal() {

  closeExistingModals();

  const habits = Storage.getHabits();

  const completions = Storage.getCompletions();

  const year = Grid.currentYear;

  const month = Grid.currentMonth;

  const prefix =
    `${year}-${String(month).padStart(2, "0")}`;


  const monthCompletions =
    completions.filter(function(completion) {

      return completion.dateKey.startsWith(prefix);

    });


  const days =
    DateHelpers.daysInMonth(year, month);


  const total =
    monthCompletions.length;


  const possible =
    habits.length * days;


  const percentage =
    possible > 0
      ? Math.round((total / possible) * 100)
      : 0;


  const overlay = document.createElement("div");

  overlay.id = "stats-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:9999;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;


  const modal = document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:390px;
    max-height:85vh;
    overflow-y:auto;
    background:#FFFFFF;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
  `;


  let habitHTML = "";


  habits.forEach(function(habit) {

    const count =
      monthCompletions.filter(function(completion) {

        return completion.habitId === habit.id;

      }).length;


    const goal =
      habit.monthlyGoal || days;


    const percent =
      Math.min(
        100,
        Math.round((count / goal) * 100)
      );


    const current =
      calculateHabitCurrentStreak(habit.id);


    const best =
      calculateHabitBestStreak(habit.id);


    habitHTML += `

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
          margin-bottom:10px;
        ">

          <div style="
            font-size:17px;
            font-weight:600;
          ">
            ${habit.icon || "✅"} ${habit.name}
          </div>

          <div style="
            font-weight:700;
            color:${habit.color || "#3B82F6"};
          ">
            ${percent}%
          </div>

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
            <strong>${count}</strong>
            <div style="font-size:12px;color:#8E8E93;">
              This month
            </div>
          </div>

          <div>
            <strong>${current} 🔥</strong>
            <div style="font-size:12px;color:#8E8E93;">
              Current
            </div>
          </div>

          <div>
            <strong>${best} 🏆</strong>
            <div style="font-size:12px;color:#8E8E93;">
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
      justify-content:space-between;
      align-items:center;
      margin-bottom:20px;
    ">

      <h2 style="margin:0;font-size:24px;">
        📊 Statistics
      </h2>

      <button
        id="close-stats-button"
        type="button"
        style="
          width:34px;
          height:34px;
          border:none;
          border-radius:50%;
          background:#E5E5EA;
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

        <div style="font-size:28px;font-weight:700;">
          ${percentage}%
        </div>

        <div style="font-size:14px;color:#8E8E93;">
          Monthly
        </div>

      </div>

      <div style="
        background:#F2F2F7;
        border-radius:16px;
        padding:16px;
        text-align:center;
      ">

        <div style="font-size:28px;font-weight:700;">
          ${total}
        </div>

        <div style="font-size:14px;color:#8E8E93;">
          Completions
        </div>

      </div>

    </div>

    <h3 style="margin:0 0 12px;">
      Habit Statistics
    </h3>

    ${
      habitHTML ||
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
   SETTINGS
========================================================= */

function showSettingsModal() {

  closeExistingModals();

  const overlay = document.createElement("div");

  overlay.id = "settings-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:9999;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;


  const modal = document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:360px;
    background:#FFFFFF;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
  `;


  modal.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:20px;
    ">

      <h2 style="margin:0;font-size:23px;">
        ⚙️ Settings
      </h2>

      <button
        id="close-settings-button"
        type="button"
        style="
          width:34px;
          height:34px;
          border:none;
          border-radius:50%;
          background:#E5E5EA;
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
      margin-bottom:15px;
    ">

      <div style="
        font-size:16px;
        font-weight:600;
        margin-bottom:5px;
      ">
        Habit Tracker
      </div>

      <div style="
        font-size:14px;
        color:#8E8E93;
      ">
        Manage your habits and app data.
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
      🗑️ Reset All Data
    </button>


    <button
      id="settings-done-button"
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
    .getElementById("close-settings-button")
    .addEventListener("click", function() {

      overlay.remove();

    });


  document
    .getElementById("settings-done-button")
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
   CLOSE MODALS
========================================================= */

function closeExistingModals() {

  const ids = [
    "habit-modal-overlay",
    "stats-modal-overlay",
    "settings-modal-overlay"
  ];


  ids.forEach(function(id) {

    const element =
      document.getElementById(id);

    if (element) {

      element.remove();

    }

  });

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  const habits = Storage.getHabits();

  const completions = Storage.getCompletions();

  const year = Grid.currentYear;

  const month = Grid.currentMonth;


  const prefix =
    `${year}-${String(month).padStart(2, "0")}`;


  const monthCompletions =
    completions.filter(function(completion) {

      return completion.dateKey.startsWith(prefix);

    });


  const days =
    DateHelpers.daysInMonth(year, month);


  const total =
    monthCompletions.length;


  const possible =
    habits.length * days;


  const percent =
    possible > 0
      ? Math.round((total / possible) * 100)
      : 0;


  let bestOverall = 0;


  habits.forEach(function(habit) {

    const streak =
      calculateHabitBestStreak(habit.id);

    if (streak > bestOverall) {

      bestOverall = streak;

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
      `${percent}%`;

  }


  if (totalElement) {

    totalElement.textContent =
      total;

  }


  if (streakElement) {

    streakElement.textContent =
      `${bestOverall} 🔥`;

  }


  const progress =
    document.getElementById("habit-progress");


  if (!progress) return;


  progress.innerHTML = "";


  const sorted =
    [...habits].sort(function(a, b) {

      return (a.sortOrder || 0) -
             (b.sortOrder || 0);

    });


  sorted.forEach(function(habit) {

    const count =
      monthCompletions.filter(function(completion) {

        return completion.habitId === habit.id;

      }).length;


    const goal =
      habit.monthlyGoal || days;


    const habitPercent =
      Math.min(
        100,
        Math.round((count / goal) * 100)
      );


    const current =
      calculateHabitCurrentStreak(habit.id);


    const best =
      calculateHabitBestStreak(habit.id);


    const card =
      document.createElement("div");


    card.className =
      "progress-card";


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
          ${count}/${goal}
        </div>

      </div>


      <div class="progress-track">

        <div
          class="progress-fill"
          style="
            width:${habitPercent}%;
            background:${habit.color || "#3B82F6"};
          "
        ></div>

      </div>


      <div class="progress-footer">

        <span>
          ${habitPercent}% complete
        </span>

        <span>
          🔥 ${current}
          &nbsp; • &nbsp;
          🏆 ${best}
        </span>

      </div>

    `;


    progress.appendChild(card);

  });

}


/* =========================================================
   MONTH NAVIGATION
========================================================= */

function setupMonthNavigation() {

  const previous =
    document.getElementById("prev-month");

  const next =
    document.getElementById("next-month");


  if (previous) {

    previous.onclick = function(event) {

      event.preventDefault();

      Grid.goToPrevMonth();

      updateDashboard();

    };

  }


  if (next) {

    next.onclick = function(event) {

      event.preventDefault();

      Grid.goToNextMonth();

      updateDashboard();

    };

  }

}


/* =========================================================
   START APP
========================================================= */

function startApp() {

  console.log("Habit Tracker starting...");

  seedTestHabitsIfEmpty();

  Grid.render();

  updateDashboard();

  setupMonthNavigation();

  addStatsButton();

  addSettingsButton();

  addHabitButton();

  console.log("Habit Tracker ready.");

}


/* =========================================================
   START AFTER DOM IS READY
========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );

} else {

  startApp();

}
