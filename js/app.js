/* =========================================================
   HABIT TRACKER - APP.JS
   COMPLETE VERSION
========================================================= */


/* =========================================================
   UTILITY
========================================================= */

function refreshApp() {
  Grid.render();
  updateDashboard();
}


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
   TOP BUTTON CONTAINER
========================================================= */

function createTopButtons() {

  const topbar = document.querySelector(".topbar");

  if (!topbar) {
    console.error("Topbar not found.");
    return;
  }

  let container =
    document.getElementById("top-actions");

  if (container) return;

  container =
    document.createElement("div");

  container.id = "top-actions";

  container.style.cssText = `
    display:flex;
    align-items:center;
    gap:7px;
    margin-left:auto;
    flex-shrink:0;
  `;

  topbar.appendChild(container);

  createAddButton(container);
  createStatsButton(container);
  createSettingsButton(container);
}


/* =========================================================
   ADD BUTTON
========================================================= */

function createAddButton(container) {

  const button =
    document.createElement("button");

  button.id = "add-habit-button";

  button.type = "button";

  button.textContent = "+";

  button.title = "Add Habit";

  button.setAttribute(
    "aria-label",
    "Add Habit"
  );

  button.style.cssText = `
    width:36px;
    height:36px;
    min-width:36px;
    padding:0;
    border:none;
    border-radius:50%;
    background:#3B82F6;
    color:white;
    font-size:25px;
    line-height:36px;
    font-weight:400;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      showAddHabitModal();
    }
  );

  container.appendChild(button);
}


/* =========================================================
   STATS BUTTON
========================================================= */

function createStatsButton(container) {

  const button =
    document.createElement("button");

  button.id = "stats-button";

  button.type = "button";

  button.textContent = "📊";

  button.title = "Statistics";

  button.setAttribute(
    "aria-label",
    "Statistics"
  );

  button.style.cssText = `
    width:36px;
    height:36px;
    min-width:36px;
    padding:0;
    border:1px solid #D1D1D6;
    border-radius:50%;
    background:white;
    color:#1C1C1E;
    font-size:17px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      showStatsModal();
    }
  );

  container.appendChild(button);
}


/* =========================================================
   SETTINGS BUTTON
========================================================= */

function createSettingsButton(container) {

  const button =
    document.createElement("button");

  button.id = "settings-button";

  button.type = "button";

  button.textContent = "⚙️";

  button.title = "Settings";

  button.setAttribute(
    "aria-label",
    "Settings"
  );

  button.style.cssText = `
    width:36px;
    height:36px;
    min-width:36px;
    padding:0;
    border:1px solid #D1D1D6;
    border-radius:50%;
    background:white;
    color:#1C1C1E;
    font-size:17px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    -webkit-tap-highlight-color:transparent;
  `;

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      showSettingsModal();
    }
  );

  container.appendChild(button);
}


/* =========================================================
   REMOVE OLD TOP BUTTONS
========================================================= */

function removeOldButtons() {

  const ids = [
    "add-habit-button",
    "stats-button",
    "settings-button"
  ];

  ids.forEach(id => {

    const element =
      document.getElementById(id);

    if (element) {
      element.remove();
    }

  });

  const oldContainer =
    document.getElementById("top-actions");

  if (oldContainer) {
    oldContainer.remove();
  }
}


/* =========================================================
   ADD HABIT MODAL
========================================================= */

function showAddHabitModal() {

  if (
    document.getElementById(
      "habit-modal-overlay"
    )
  ) return;

  const overlay =
    document.createElement("div");

  overlay.id =
    "habit-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:10000;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;

  const modal =
    document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:360px;
    max-height:90vh;
    overflow-y:auto;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,.25);
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
    >

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
    >

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
      >

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
    >

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
    document.getElementById(
      "habit-color-input"
    );

  const colorValue =
    document.getElementById(
      "habit-color-value"
    );

  colorInput.addEventListener(
    "input",
    function() {
      colorValue.textContent =
        colorInput.value;
    }
  );

  document
    .getElementById("cancel-habit-button")
    .addEventListener(
      "click",
      function() {
        overlay.remove();
      }
    );

  document
    .getElementById("save-habit-button")
    .addEventListener(
      "click",
      function() {

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
          alert(
            "Please enter a habit name."
          );
          return;
        }

        if (
          !Number.isFinite(goal) ||
          goal < 1 ||
          goal > 31
        ) {
          alert(
            "Monthly goal must be between 1 and 31."
          );
          return;
        }

        const habits =
          Storage.getHabits();

        Storage.addHabit(
          Models.createHabit({
            name:name,
            icon:icon,
            color:color,
            monthlyGoal:goal,
            sortOrder:habits.length
          })
        );

        overlay.remove();

        refreshApp();
      }
    );

  overlay.addEventListener(
    "click",
    function(event) {

      if (
        event.target === overlay
      ) {
        overlay.remove();
      }

    }
  );

  setTimeout(
    function() {

      const input =
        document.getElementById(
          "habit-name-input"
        );

      if (input) {
        input.focus();
      }

    },
    50
  );
}


/* =========================================================
   STREAK HELPERS
========================================================= */

function getHabitDates(habitId) {

  return [
    ...new Set(
      Storage
        .getCompletions()
        .filter(
          completion =>
            completion.habitId === habitId
        )
        .map(
          completion =>
            completion.dateKey
        )
    )
  ].sort();
}


function calculateHabitBestStreak(habitId) {

  const dates =
    getHabitDates(habitId);

  if (!dates.length) return 0;

  let best = 1;
  let current = 1;

  for (
    let i = 1;
    i < dates.length;
    i++
  ) {

    const previous =
      new Date(
        dates[i - 1] + "T00:00:00"
      );

    const currentDate =
      new Date(
        dates[i] + "T00:00:00"
      );

    const difference =
      Math.round(
        (
          currentDate - previous
        ) /
        86400000
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


function calculateHabitCurrentStreak(habitId) {

  const dates =
    getHabitDates(habitId).reverse();

  if (!dates.length) return 0;

  let streak = 1;

  for (
    let i = 0;
    i < dates.length - 1;
    i++
  ) {

    const current =
      new Date(
        dates[i] + "T00:00:00"
      );

    const previous =
      new Date(
        dates[i + 1] + "T00:00:00"
      );

    const difference =
      Math.round(
        (
          current - previous
        ) /
        86400000
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
   STATS MODAL
========================================================= */

function showStatsModal() {

  if (
    document.getElementById(
      "stats-modal-overlay"
    )
  ) return;

  const habits =
    Storage.getHabits();

  const completions =
    Storage.getCompletions();

  const year =
    Grid.currentYear;

  const month =
    Grid.currentMonth;

  const prefix =
    `${year}-${String(month).padStart(2,"0")}`;

  const monthCompletions =
    completions.filter(
      completion =>
        completion.dateKey.startsWith(prefix)
    );

  const days =
    DateHelpers.daysInMonth(
      year,
      month
    );

  const total =
    monthCompletions.length;

  const possible =
    habits.length * days;

  const overall =
    possible > 0
      ? Math.round(
          total / possible * 100
        )
      : 0;

  const overlay =
    document.createElement("div");

  overlay.id =
    "stats-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:11000;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;

  const modal =
    document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:390px;
    max-height:85vh;
    overflow-y:auto;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,.25);
  `;

  let cards = "";

  habits.forEach(
    habit => {

      const count =
        monthCompletions.filter(
          completion =>
            completion.habitId === habit.id
        ).length;

      const goal =
        habit.monthlyGoal || days;

      const percent =
        Math.min(
          100,
          Math.round(
            count / goal * 100
          )
        );

      const current =
        calculateHabitCurrentStreak(
          habit.id
        );

      const best =
        calculateHabitBestStreak(
          habit.id
        );

      cards += `

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

            <strong>
              ${habit.icon || "✅"}
              ${habit.name}
            </strong>

            <strong style="
              color:${habit.color || "#3B82F6"};
            ">
              ${percent}%
            </strong>

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
            "></div>

          </div>

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr 1fr;
            text-align:center;
          ">

            <div>
              <strong>${count}</strong>
              <small style="
                display:block;
                color:#8E8E93;
              ">
                This month
              </small>
            </div>

            <div>
              <strong>${current} 🔥</strong>
              <small style="
                display:block;
                color:#8E8E93;
              ">
                Current
              </small>
            </div>

            <div>
              <strong>${best} 🏆</strong>
              <small style="
                display:block;
                color:#8E8E93;
              ">
                Best
              </small>
            </div>

          </div>

        </div>
      `;
    }
  );

  modal.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
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
        <div style="
          font-size:28px;
          font-weight:700;
        ">
          ${overall}%
        </div>
        <small style="color:#8E8E93;">
          Monthly
        </small>
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
          ${total}
        </div>
        <small style="color:#8E8E93;">
          Completions
        </small>
      </div>

    </div>

    <h3 style="
      margin:0 0 12px;
    ">
      Habit Statistics
    </h3>

    ${
      cards ||
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
    .addEventListener(
      "click",
      () => overlay.remove()
    );

  document
    .getElementById("stats-done-button")
    .addEventListener(
      "click",
      () => overlay.remove()
    );

  overlay.addEventListener(
    "click",
    event => {

      if (
        event.target === overlay
      ) {
        overlay.remove();
      }

    }
  );
}


/* =========================================================
   SETTINGS MODAL
========================================================= */

function showSettingsModal() {

  if (
    document.getElementById(
      "settings-modal-overlay"
    )
  ) return;

  const overlay =
    document.createElement("div");

  overlay.id =
    "settings-modal-overlay";

  overlay.style.cssText = `
    position:fixed;
    inset:0;
    z-index:12000;
    background:rgba(0,0,0,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    box-sizing:border-box;
  `;

  const modal =
    document.createElement("div");

  modal.style.cssText = `
    width:100%;
    max-width:360px;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-sizing:border-box;
    box-shadow:0 15px 40px rgba(0,0,0,.25);
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
      margin-bottom:12px;
    ">

      <strong>
        Habit Tracker
      </strong>

      <div style="
        color:#8E8E93;
        font-size:14px;
        margin-top:5px;
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
      🗑️ Reset All Data
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
    .addEventListener(
      "click",
      () => overlay.remove()
    );

  document
    .getElementById("settings-close-button")
    .addEventListener(
      "click",
      () => overlay.remove()
    );

  document
    .getElementById("reset-data-button")
    .addEventListener(
      "click",
      function() {

        const confirmed =
          confirm(
            "Delete all habits and completions?"
          );

        if (!confirmed) return;

        localStorage.clear();

        location.reload();
      }
    );

  overlay.addEventListener(
    "click",
    event => {

      if (
        event.target === overlay
      ) {
        overlay.remove();
      }

    }
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  const habits =
    Storage.getHabits();

  const completions =
    Storage.getCompletions();

  const year =
    Grid.currentYear;

  const month =
    Grid.currentMonth;

  const prefix =
    `${year}-${String(month).padStart(2,"0")}`;

  const monthCompletions =
    completions.filter(
      completion =>
        completion.dateKey.startsWith(prefix)
    );

  const days =
    DateHelpers.daysInMonth(
      year,
      month
    );

  const total =
    monthCompletions.length;

  const possible =
    habits.length * days;

  const percent =
    possible > 0
      ? Math.round(
          total / possible * 100
        )
      : 0;

  let bestOverall = 0;

  habits.forEach(
    habit => {

      const best =
        calculateHabitBestStreak(
          habit.id
        );

      if (best > bestOverall) {
        bestOverall = best;
      }
    }
  );

  const percentElement =
    document.getElementById(
      "overall-percent"
    );

  const totalElement =
    document.getElementById(
      "total-completions"
    );

  const streakElement =
    document.getElementById(
      "best-streak"
    );

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

  const container =
    document.getElementById(
      "habit-progress"
    );

  if (!container) return;

  container.innerHTML = "";

  const sortedHabits =
    [...habits].sort(
      (a,b) =>
        (a.sortOrder || 0) -
        (b.sortOrder || 0)
    );

  sortedHabits.forEach(
    habit => {

      const count =
        monthCompletions.filter(
          completion =>
            completion.habitId === habit.id
        ).length;

      const goal =
        habit.monthlyGoal || days;

      const progress =
        Math.min(
          100,
          Math.round(
            count / goal * 100
          )
        );

      const current =
        calculateHabitCurrentStreak(
          habit.id
        );

      const best =
        calculateHabitBestStreak(
          habit.id
        );

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
              width:${progress}%;
              background:${habit.color || "#3B82F6"};
            "
          ></div>

        </div>

        <div class="progress-footer">

          <span>
            ${progress}% complete
          </span>

          <span>
            🔥 ${current}
            &nbsp;•&nbsp;
            🏆 ${best}
          </span>

        </div>
      `;

      container.appendChild(card);
    }
  );
}


/* =========================================================
   MONTH NAVIGATION
========================================================= */

function setupMonthNavigation() {

  const previous =
    document.getElementById(
      "prev-month"
    );

  const next =
    document.getElementById(
      "next-month"
    );

  if (previous) {

    previous.type = "button";

    previous.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        Grid.goToPrevMonth();

        updateDashboard();
      }
    );
  }

  if (next) {

    next.type = "button";

    next.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        Grid.goToNextMonth();

        updateDashboard();
      }
    );
  }
}


/* =========================================================
   START APPLICATION
========================================================= */

function startApp() {

  try {

    seedTestHabitsIfEmpty();

    Grid.render();

    updateDashboard();

    removeOldButtons();

    createTopButtons();

    setupMonthNavigation();

    console.log(
      "Habit Tracker started successfully."
    );

  } catch (error) {

    console.error(
      "Habit Tracker startup error:",
      error
    );

  }
}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );

} else {

  startApp();

}
