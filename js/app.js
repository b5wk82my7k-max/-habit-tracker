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


/* =========================
   ADD HABIT BUTTON
========================= */

function addHabitButton() {
  const topbar = document.querySelector(".topbar");

  const button = document.createElement("button");

  button.id = "add-habit-button";
  button.textContent = "+";
  button.title = "Add Habit";

  button.style.cssText = `
    background:#3B82F6;
    color:white;
    border:none;
    width:36px;
    height:36px;
    border-radius:50%;
    font-size:25px;
    line-height:36px;
    font-weight:400;
    cursor:pointer;
  `;

  button.addEventListener("click", showAddHabitModal);

  topbar.appendChild(button);
}


/* =========================
   STATS BUTTON
========================= */

function addStatsButton() {
  const topbar = document.querySelector(".topbar");

  const button = document.createElement("button");

  button.id = "stats-button";
  button.textContent = "📊";
  button.title = "Statistics";

  button.style.cssText = `
    background:white;
    color:#3B82F6;
    border:1px solid #D1D1D6;
    width:36px;
    height:36px;
    border-radius:50%;
    font-size:17px;
    cursor:pointer;
    margin-right:8px;
  `;

  button.addEventListener("click", showStatsModal);

  topbar.appendChild(button);
}


/* =========================
   ADD HABIT MODAL
========================= */

function showAddHabitModal() {
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
    z-index:100;
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
        style="
          font-size:15px;
          color:#8E8E93;
        "
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


  const colorInput =
    document.getElementById("habit-color-input");

  const colorValue =
    document.getElementById("habit-color-value");

  colorInput.addEventListener("input", () => {
    colorValue.textContent = colorInput.value;
  });


  document
    .getElementById("cancel-habit-button")
    .addEventListener("click", () => {
      overlay.remove();
    });


  document
    .getElementById("save-habit-button")
    .addEventListener("click", () => {

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


      const habits = Storage.getHabits();


      Storage.addHabit(
        Models.createHabit({
          name,
          icon,
          color,
          monthlyGoal: goal,
          sortOrder: habits.length
        })
      );


      overlay.remove();

      Grid.render();
      updateDashboard();
    });
}


/* =========================
   HABIT BEST STREAK
========================= */

function calculateHabitBestStreak(habitId) {
  const completions =
    Storage.getCompletions()
      .filter(
        completion =>
          completion.habitId === habitId
      );

  if (completions.length === 0) {
    return 0;
  }

  const dates = [
    ...new Set(
      completions.map(
        completion => completion.dateKey
      )
    )
  ].sort();

  let bestStreak = 1;
  let currentStreak = 1;


  for (let i = 1; i < dates.length; i++) {

    const previousDate =
      new Date(
        dates[i - 1] + "T00:00:00"
      );

    const currentDate =
      new Date(
        dates[i] + "T00:00:00"
      );


    const difference =
      (currentDate - previousDate) /
      (1000 * 60 * 60 * 24);


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


/* =========================
   CURRENT STREAK
========================= */

function calculateHabitCurrentStreak(habitId) {
  const completions =
    Storage.getCompletions()
      .filter(
        completion =>
          completion.habitId === habitId
      );

  if (completions.length === 0) {
    return 0;
  }

  const dates = [
    ...new Set(
      completions.map(
        completion => completion.dateKey
      )
    )
  ].sort().reverse();


  let streak = 1;


  for (let i = 0; i < dates.length - 1; i++) {

    const currentDate =
      new Date(
        dates[i] + "T00:00:00"
      );

    const previousDate =
      new Date(
        dates[i + 1] + "T00:00:00"
      );


    const difference =
      (currentDate - previousDate) /
      (1000 * 60 * 60 * 24);


    if (difference === 1) {
      streak++;
    } else {
      break;
    }
  }


  return streak;
}


/* =========================
   STATS MODAL
========================= */

function showStatsModal() {

  const habits = Storage.getHabits();
  const completions = Storage.getCompletions();

  const year = Grid.currentYear;
  const month = Grid.currentMonth;

  const monthPrefix =
    `${year}-${String(month).padStart(2, "0")}`;


  const monthCompletions =
    completions.filter(
      completion =>
        completion.dateKey.startsWith(
          monthPrefix
        )
    );


  const daysInMonth =
    DateHelpers.daysInMonth(
      year,
      month
    );


  const totalCompletions =
    monthCompletions.length;


  const possibleCompletions =
    habits.length * daysInMonth;


  const overallPercent =
    possibleCompletions > 0
      ? Math.round(
          (totalCompletions /
            possibleCompletions) *
            100
        )
      : 0;


  const overlay =
    document.createElement("div");


  overlay.id = "stats-modal-overlay";


  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:200;
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
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    box-sizing:border-box;
  `;


  let habitStatsHTML = "";


  habits.forEach(habit => {

    const habitCompletions =
      monthCompletions.filter(
        completion =>
          completion.habitId === habit.id
      ).length;


    const goal =
      habit.monthlyGoal ||
      daysInMonth;


    const percent =
      Math.min(
        100,
        Math.round(
          (habitCompletions / goal) *
            100
        )
      );


    const bestStreak =
      calculateHabitBestStreak(
        habit.id
      );


    const currentStreak =
      calculateHabitCurrentStreak(
        habit.id
      );


    habitStatsHTML += `
      <div
        style="
          background:#F2F2F7;
          border-radius:16px;
          padding:15px;
          margin-bottom:12px;
        "
      >

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:12px;
          "
        >

          <div
            style="
              display:flex;
              align-items:center;
              gap:8px;
              font-size:17px;
              font-weight:600;
            "
          >
            <span>${habit.icon}</span>
            <span>${habit.name}</span>
          </div>

          <span
            style="
              font-weight:600;
              color:${habit.color || "#3B82F6"};
            "
          >
            ${percent}%
          </span>

        </div>


        <div
          style="
            height:8px;
            background:#E5E5EA;
            border-radius:10px;
            overflow:hidden;
            margin-bottom:12px;
          "
        >

          <div
            style="
              width:${percent}%;
              height:100%;
              background:${habit.color || "#3B82F6"};
              border-radius:10px;
            "
          ></div>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr 1fr;
            gap:8px;
            text-align:center;
          "
        >

          <div>
            <div
              style="
                font-size:18px;
                font-weight:600;
              "
            >
              ${habitCompletions}
            </div>

            <div
              style="
                font-size:12px;
                color:#8E8E93;
              "
            >
              This month
            </div>
          </div>


          <div>
            <div
              style="
                font-size:18px;
                font-weight:600;
              "
            >
              ${currentStreak} 🔥
            </div>

            <div
              style="
                font-size:12px;
                color:#8E8E93;
              "
            >
              Current
            </div>
          </div>


          <div>
            <div
              style="
                font-size:18px;
                font-weight:600;
              "
            >
              ${bestStreak} 🏆
            </div>

            <div
              style="
                font-size:12px;
                color:#8E8E93;
              "
            >
              Best
            </div>
          </div>

        </div>

      </div>
    `;
  });


  modal.innerHTML = `

    <div
      style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-bottom:20px;
      "
    >

      <h2
        style="
          margin:0;
          font-size:24px;
        "
      >
        📊 Statistics
      </h2>

      <button
        id="close-stats-button"
        style="
          border:none;
          background:#E5E5EA;
          width:34px;
          height:34px;
          border-radius:50%;
          font-size:20px;
          cursor:pointer;
        "
      >
        ×
      </button>

    </div>


    <div
      style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-bottom:20px;
      "
    >

      <div
        style="
          background:#F2F2F7;
          border-radius:16px;
          padding:16px;
          text-align:center;
        "
      >

        <div
          style="
            font-size:28px;
            font-weight:700;
          "
        >
          ${overallPercent}%
        </div>

        <div
          style="
            color:#8E8E93;
            font-size:14px;
          "
        >
          Monthly
        </div>

      </div>


      <div
        style="
          background:#F2F2F7;
          border-radius:16px;
          padding:16px;
          text-align:center;
        "
      >

        <div
          style="
            font-size:28px;
            font-weight:700;
          "
        >
          ${totalCompletions}
        </div>

        <div
          style="
            color:#8E8E93;
            font-size:14px;
          "
        >
          Completions
        </div>

      </div>

    </div>


    <h3
      style="
        margin:0 0 12px;
        font-size:18px;
      "
    >
      Habit Statistics
    </h3>

    ${habitStatsHTML}


    <button
      id="stats-done-button"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#3B82F6;
        color:white;
        font-size:16px;
        font-weight:600;
        margin-top:4px;
      "
    >
      Done
    </button>

  `;


  overlay.appendChild(modal);
  document.body.appendChild(overlay);


  document
    .getElementById("close-stats-button")
    .addEventListener("click", () => {
      overlay.remove();
    });


  document
    .getElementById("stats-done-button")
    .addEventListener("click", () => {
      overlay.remove();
    });


  overlay.addEventListener("click", event => {

    if (event.target === overlay) {
      overlay.remove();
    }

  });
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

  const habits =
    Storage.getHabits();

  const completions =
    Storage.getCompletions();


  const year =
    Grid.currentYear;

  const month =
    Grid.currentMonth;


  const monthPrefix =
    `${year}-${String(month).padStart(2, "0")}`;


  const monthCompletions =
    completions.filter(
      completion =>
        completion.dateKey.startsWith(
          monthPrefix
        )
    );


  const totalCompletions =
    monthCompletions.length;


  const daysInMonth =
    DateHelpers.daysInMonth(
      year,
      month
    );


  const possibleCompletions =
    habits.length * daysInMonth;


  const overallPercent =
    possibleCompletions > 0
      ? Math.round(
          (totalCompletions /
            possibleCompletions) *
            100
        )
      : 0;


  /* Find best streak across individual habits */

  let bestStreak = 0;

  habits.forEach(habit => {

    const habitBest =
      calculateHabitBestStreak(
        habit.id
      );

    if (habitBest > bestStreak) {
      bestStreak = habitBest;
    }

  });


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


  const progressContainer =
    document.getElementById(
      "habit-progress"
    );


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


  if (!progressContainer) {
    return;
  }


  progressContainer.innerHTML = "";


  habits.forEach(habit => {

    const habitCompletions =
      monthCompletions.filter(
        completion =>
          completion.habitId ===
          habit.id
      ).length;


    const goal =
      habit.monthlyGoal ||
      daysInMonth;


    const percent =
      Math.min(
        100,
        Math.round(
          (habitCompletions / goal) *
            100
        )
      );


    const card =
      document.createElement("div");


    card.className =
      "progress-card";


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
            background:${habit.color || "#3B82F6"};
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


/* =========================
   MONTH NAVIGATION
========================= */

document
  .getElementById("prev-month")
  .addEventListener("click", () => {

    Grid.goToPrevMonth();
    updateDashboard();

  });


document
  .getElementById("next-month")
  .addEventListener("click", () => {

    Grid.goToNextMonth();
    updateDashboard();

  });


/* =========================
   START APP
========================= */

seedTestHabitsIfEmpty();

addStatsButton();

addHabitButton();

Grid.render();

updateDashboard();
