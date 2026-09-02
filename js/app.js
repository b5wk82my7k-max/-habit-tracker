/* =========================================================
   HABIT TRACKER - APP.JS
   Complete version
========================================================= */


/* =========================================================
   SETTINGS STORAGE
========================================================= */

const AppSettings = {

  get() {

    try {

      const saved =
        localStorage.getItem("habitTrackerSettings");

      const settings =
        saved ? JSON.parse(saved) : {};

      return {

        darkMode:
          settings.darkMode === true,

        weekStartsMonday:
          settings.weekStartsMonday === true,

        reminders:
          settings.reminders === true

      };

    } catch (error) {

      return {

        darkMode: false,
        weekStartsMonday: false,
        reminders: false

      };

    }

  },


  save(settings) {

    localStorage.setItem(
      "habitTrackerSettings",
      JSON.stringify(settings)
    );

  },


  update(changes) {

    const current =
      this.get();

    this.save({
      ...current,
      ...changes
    });

  }

};


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   APPLY APP SETTINGS
========================================================= */

function applyAppSettings() {

  const settings =
    AppSettings.get();

  document.body.classList.toggle(
    "dark-mode",
    settings.darkMode
  );

}


/* =========================================================
   SEED DEFAULT HABITS
========================================================= */

function seedTestHabitsIfEmpty() {

  const habits =
    Storage.getHabits();

  if (habits.length !== 0) {
    return;
  }


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
   REFRESH APP
========================================================= */

function refreshApp() {

  if (
    typeof Grid !== "undefined" &&
    Grid.render
  ) {

    Grid.render();

  }

  updateDashboard();

}


/* =========================================================
   TOPBAR BUTTON HELPER
========================================================= */

function createTopbarButton(
  id,
  text,
  title,
  clickHandler,
  primary = false
) {

  const topbar =
    document.querySelector(".topbar");

  if (!topbar) {
    return;
  }


  if (
    document.getElementById(id)
  ) {

    return;

  }


  const button =
    document.createElement("button");


  button.id = id;

  button.textContent = text;

  button.title = title;

  button.setAttribute(
    "aria-label",
    title
  );


  button.style.cssText = `

    background:${primary ? "#3B82F6" : "white"};

    color:${primary ? "white" : "#1C1C1E"};

    border:1px solid ${primary ? "#3B82F6" : "#D1D1D6"};

    width:36px;
    height:36px;

    min-width:36px;

    border-radius:50%;

    font-size:${primary ? "25px" : "17px"};

    line-height:36px;

    font-weight:400;

    cursor:pointer;

    margin-left:8px;

    padding:0;

    display:flex;

    align-items:center;

    justify-content:center;

  `;


  button.addEventListener(
    "click",
    clickHandler
  );


  topbar.appendChild(button);

}


/* =========================================================
   ADD HABIT BUTTON
========================================================= */

function addHabitButton() {

  createTopbarButton(

    "add-habit-button",

    "+",

    "Add Habit",

    showAddHabitModal,

    true

  );

}


/* =========================================================
   STATS BUTTON
========================================================= */

function addStatsButton() {

  createTopbarButton(

    "stats-button",

    "📊",

    "Statistics",

    showStatsModal

  );

}


/* =========================================================
   SETTINGS BUTTON
========================================================= */

function addSettingsButton() {

  createTopbarButton(

    "settings-button",

    "⚙️",

    "Settings",

    showSettingsModal

  );

}


/* =========================================================
   MODAL BASE
========================================================= */

function createModal(
  id,
  maxWidth = "360px",
  zIndex = 1000
) {

  const old =
    document.getElementById(id);

  if (old) {
    old.remove();
  }


  const overlay =
    document.createElement("div");


  overlay.id = id;


  overlay.style.cssText = `

    position:fixed;
    inset:0;

    background:rgba(0,0,0,0.45);

    display:flex;

    align-items:center;
    justify-content:center;

    padding:20px;

    z-index:${zIndex};

    box-sizing:border-box;

  `;


  const modal =
    document.createElement("div");


  modal.style.cssText = `

    width:100%;

    max-width:${maxWidth};

    max-height:90vh;

    overflow-y:auto;

    background:white;

    color:#1C1C1E;

    border-radius:20px;

    padding:22px;

    box-shadow:0 15px 40px rgba(0,0,0,0.25);

    box-sizing:border-box;

  `;


  overlay.appendChild(modal);

  document.body.appendChild(overlay);


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


  return {
    overlay,
    modal
  };

}


/* =========================================================
   ADD HABIT MODAL
========================================================= */

function showAddHabitModal() {

  const {
    overlay,
    modal
  } = createModal(
    "habit-modal-overlay",
    "360px",
    1000
  );


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
    () => {

      colorValue.textContent =
        colorInput.value;

    }
  );


  document
    .getElementById(
      "cancel-habit-button"
    )
    .addEventListener(
      "click",
      () => overlay.remove()
    );


  const saveHabit = () => {

    const name =
      document
        .getElementById(
          "habit-name-input"
        )
        .value
        .trim();


    const icon =
      document
        .getElementById(
          "habit-icon-input"
        )
        .value
        .trim() || "✅";


    const color =
      document
        .getElementById(
          "habit-color-input"
        )
        .value;


    const goal =
      Number(
        document
          .getElementById(
            "habit-goal-input"
          )
          .value
      );


    if (!name) {

      alert(
        "Please enter a habit name."
      );

      return;

    }


    if (
      !goal ||
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

        name,
        icon,
        color,

        monthlyGoal:
          goal,

        sortOrder:
          habits.length

      })

    );


    overlay.remove();

    refreshApp();

  };


  document
    .getElementById(
      "save-habit-button"
    )
    .addEventListener(
      "click",
      saveHabit
    );


  document
    .getElementById(
      "habit-name-input"
    )
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {

          saveHabit();

        }

      }
    );


  setTimeout(() => {

    document
      .getElementById(
        "habit-name-input"
      )
      ?.focus();

  }, 50);

}


/* =========================================================
   BEST STREAK
========================================================= */

function calculateHabitBestStreak(
  habitId
) {

  const completions =
    Storage.getCompletions()
      .filter(
        completion =>
          String(completion.habitId) ===
          String(habitId)
      );


  if (
    completions.length === 0
  ) {

    return 0;

  }


  const dates = [
    ...new Set(
      completions.map(
        completion =>
          completion.dateKey
      )
    )
  ].sort();


  let bestStreak = 1;

  let currentStreak = 1;


  for (
    let i = 1;
    i < dates.length;
    i++
  ) {

    const previousDate =
      new Date(
        dates[i - 1] +
        "T00:00:00"
      );


    const currentDate =
      new Date(
        dates[i] +
        "T00:00:00"
      );


    const difference =
      Math.round(
        (
          currentDate -
          previousDate
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (
      difference === 1
    ) {

      currentStreak++;


      bestStreak =
        Math.max(
          bestStreak,
          currentStreak
        );

    } else {

      currentStreak = 1;

    }

  }


  return bestStreak;

}


/* =========================================================
   CURRENT STREAK
========================================================= */

function calculateHabitCurrentStreak(
  habitId
) {

  const completions =
    Storage.getCompletions()
      .filter(
        completion =>
          String(completion.habitId) ===
          String(habitId)
      );


  if (
    completions.length === 0
  ) {

    return 0;

  }


  const dates = [
    ...new Set(
      completions.map(
        completion =>
          completion.dateKey
      )
    )
  ].sort().reverse();


  if (
    dates.length === 0
  ) {

    return 0;

  }


  let streak = 1;


  for (
    let i = 0;
    i < dates.length - 1;
    i++
  ) {

    const currentDate =
      new Date(
        dates[i] +
        "T00:00:00"
      );


    const previousDate =
      new Date(
        dates[i + 1] +
        "T00:00:00"
      );


    const difference =
      Math.round(
        (
          currentDate -
          previousDate
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (
      difference === 1
    ) {

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


  const daysInMonth =
    DateHelpers.daysInMonth(
      year,
      month
    );


  const totalCompletions =
    monthCompletions.length;


  const possibleCompletions =
    habits.length *
    daysInMonth;


  const overallPercent =
    possibleCompletions > 0

      ? Math.round(
          (
            totalCompletions /
            possibleCompletions
          ) * 100
        )

      : 0;


  const {
    overlay,
    modal
  } = createModal(
    "stats-modal-overlay",
    "390px",
    2000
  );


  let habitStatsHTML = "";


  const sortedHabits =
    [...habits].sort(
      (a, b) =>
        (a.sortOrder || 0) -
        (b.sortOrder || 0)
    );


  sortedHabits.forEach(
    habit => {

      const habitCompletions =
        monthCompletions.filter(
          completion =>
            String(completion.habitId) ===
            String(habit.id)
        ).length;


      const goal =
        habit.monthlyGoal ||
        daysInMonth;


      const percent =
        Math.min(
          100,
          Math.round(
            (
              habitCompletions /
              goal
            ) * 100
          )
        );


      const currentStreak =
        calculateHabitCurrentStreak(
          habit.id
        );


      const bestStreak =
        calculateHabitBestStreak(
          habit.id
        );


      habitStatsHTML += `

        <div style="
          background:#F2F2F7;
          border-radius:16px;
          padding:15px;
          margin-bottom:12px;
        ">

          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
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
                ${escapeHTML(habit.icon || "✅")}
              </span>

              <span style="
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
              ">
                ${escapeHTML(habit.name)}
              </span>

            </div>


            <span style="
              font-weight:600;
              color:${habit.color || "#3B82F6"};
              margin-left:10px;
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
            gap:8px;
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

    }
  );


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


  document
    .getElementById(
      "close-stats-button"
    )
    .addEventListener(
      "click",
      () => overlay.remove()
    );


  document
    .getElementById(
      "stats-done-button"
    )
    .addEventListener(
      "click",
      () => overlay.remove()
    );

}


/* =========================================================
   SETTINGS MODAL
========================================================= */

function showSettingsModal() {

  const settings =
    AppSettings.get();


  const {
    overlay,
    modal
  } = createModal(
    "settings-modal-overlay",
    "380px",
    3000
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
        font-size:23px;
      ">
        ⚙️ Settings
      </h2>


      <button
        id="close-settings"
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


    <!-- DARK MODE -->

    <div style="
      background:#F2F2F7;
      border-radius:14px;
      padding:15px;
      margin-bottom:12px;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <div>

          <div style="
            font-size:16px;
            font-weight:600;
          ">
            🌙 Dark Mode
          </div>

          <div style="
            color:#8E8E93;
            font-size:13px;
            margin-top:3px;
          ">
            Use a darker appearance
          </div>

        </div>


        <label style="
          position:relative;
          display:inline-block;
          width:50px;
          height:30px;
        ">

          <input
            id="dark-mode-toggle"
            type="checkbox"
            ${settings.darkMode ? "checked" : ""}
            style="
              opacity:0;
              width:0;
              height:0;
            "
          />

          <span
            style="
              position:absolute;
              cursor:pointer;
              inset:0;
              background:${settings.darkMode ? "#3B82F6" : "#D1D1D6"};
              border-radius:30px;
            "
          ></span>

          <span
            id="dark-mode-knob"
            style="
              position:absolute;
              width:24px;
              height:24px;
              left:${settings.darkMode ? "23px" : "3px"};
              top:3px;
              background:white;
              border-radius:50%;
              transition:0.2s;
            "
          ></span>

        </label>

      </div>

    </div>


    <!-- WEEK START -->

    <div style="
      background:#F2F2F7;
      border-radius:14px;
      padding:15px;
      margin-bottom:12px;
    ">

      <div style="
        font-size:16px;
        font-weight:600;
        margin-bottom:10px;
      ">
        📅 Week starts on
      </div>


      <div style="
        display:flex;
        gap:8px;
      ">

        <button
          id="week-sunday"
          style="
            flex:1;
            padding:11px;
            border:none;
            border-radius:10px;
            background:${!settings.weekStartsMonday ? "#3B82F6" : "#E5E5EA"};
            color:${!settings.weekStartsMonday ? "white" : "#1C1C1E"};
            font-weight:600;
          "
        >
          Sunday
        </button>


        <button
          id="week-monday"
          style="
            flex:1;
            padding:11px;
            border:none;
            border-radius:10px;
            background:${settings.weekStartsMonday ? "#3B82F6" : "#E5E5EA"};
            color:${settings.weekStartsMonday ? "white" : "#1C1C1E"};
            font-weight:600;
          "
        >
          Monday
        </button>

      </div>

    </div>


    <!-- REMINDERS -->

    <div style="
      background:#F2F2F7;
      border-radius:14px;
      padding:15px;
      margin-bottom:12px;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <div>

          <div style="
            font-size:16px;
            font-weight:600;
          ">
            🔔 Reminders
          </div>

          <div style="
            color:#8E8E93;
            font-size:13px;
            margin-top:3px;
          ">
            Reminder preference
          </div>

        </div>


        <input
          id="reminders-toggle"
          type="checkbox"
          ${settings.reminders ? "checked" : ""}
          style="
            width:20px;
            height:20px;
          "
        />

      </div>

    </div>


    <!-- APP INFO -->

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
        ℹ️ About
      </div>

      <div style="
        color:#8E8E93;
        font-size:13px;
        line-height:1.5;
      ">
        Habit Tracker<br>
        Simple daily habit tracking.<br>
        Version 1.0
      </div>

    </div>


    <!-- RESET -->

    <button
      id="reset-data-button"
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


  /* DARK MODE */

  const darkToggle =
    document.getElementById(
      "dark-mode-toggle"
    );


  darkToggle.addEventListener(
    "change",
    () => {

      AppSettings.update({
        darkMode:
          darkToggle.checked
      });


      applyAppSettings();


      const knob =
        document.getElementById(
          "dark-mode-knob"
        );


      const track =
        darkToggle.parentElement
          .querySelector("span");


      if (knob) {

        knob.style.left =
          darkToggle.checked
            ? "23px"
            : "3px";

      }


      if (track) {

        track.style.background =
          darkToggle.checked
            ? "#3B82F6"
            : "#D1D1D6";

      }

    }
  );


  /* WEEK START */

  document
    .getElementById(
      "week-sunday"
    )
    .addEventListener(
      "click",
      () => {

        AppSettings.update({
          weekStartsMonday: false
        });

        refreshApp();

        overlay.remove();

      }
    );


  document
    .getElementById(
      "week-monday"
    )
    .addEventListener(
      "click",
      () => {

        AppSettings.update({
          weekStartsMonday: true
        });

        refreshApp();

        overlay.remove();

      }
    );


  /* REMINDERS */

  document
    .getElementById(
      "reminders-toggle"
    )
    .addEventListener(
      "change",
      event => {

        AppSettings.update({

          reminders:
            event.target.checked

        });

      }
    );


  /* CLOSE */

  document
    .getElementById(
      "close-settings"
    )
    .addEventListener(
      "click",
      () => overlay.remove()
    );


  document
    .getElementById(
      "settings-close-button"
    )
    .addEventListener(
      "click",
      () => overlay.remove()
    );


  /* RESET */

  document
    .getElementById(
      "reset-data-button"
    )
    .addEventListener(
      "click",
      () => {

        const confirmed =
          confirm(
            "Delete all habits and completion records?\n\nThis cannot be undone."
          );


        if (!confirmed) {
          return;
        }


        localStorage.clear();

        overlay.remove();

        location.reload();

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
    habits.length *
    daysInMonth;


  const overallPercent =
    possibleCompletions > 0

      ? Math.round(
          (
            totalCompletions /
            possibleCompletions
          ) * 100
        )

      : 0;


  /* BEST OVERALL STREAK */

  let bestStreak = 0;


  habits.forEach(
    habit => {

      const streak =
        calculateHabitBestStreak(
          habit.id
        );


      bestStreak =
        Math.max(
          bestStreak,
          streak
        );

    }
  );


  /* TOP CARDS */

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


  /* PROGRESS */

  const progressContainer =
    document.getElementById(
      "habit-progress"
    );


  if (!progressContainer) {
    return;
  }


  progressContainer.innerHTML =
    "";


  const sortedHabits =
    [...habits].sort(
      (a, b) =>
        (a.sortOrder || 0) -
        (b.sortOrder || 0)
    );


  sortedHabits.forEach(
    habit => {

      const habitCompletions =
        monthCompletions.filter(
          completion =>
            String(completion.habitId) ===
            String(habit.id)
        ).length;


      const goal =
        habit.monthlyGoal ||
        daysInMonth;


      const percent =
        Math.min(
          100,
          Math.round(
            (
              habitCompletions /
              goal
            ) * 100
          )
        );


      const currentStreak =
        calculateHabitCurrentStreak(
          habit.id
        );


      const bestHabitStreak =
        calculateHabitBestStreak(
          habit.id
        );


      const card =
        document.createElement(
          "div"
        );


      card.className =
        "progress-card";


      card.innerHTML = `

        <div class="progress-header">

          <div class="progress-name">

            <span>
              ${escapeHTML(
                habit.icon || "✅"
              )}
            </span>

            <span>
              ${escapeHTML(
                habit.name
              )}
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


      progressContainer.appendChild(
        card
      );

    }
  );


  if (
    habits.length === 0
  ) {

    progressContainer.innerHTML = `

      <div style="
        text-align:center;
        padding:25px;
        color:#8E8E93;
      ">
        No habits yet.<br>
        Tap + to add your first habit.
      </div>

    `;

  }

}


/* =========================================================
   MONTH NAVIGATION
========================================================= */

const previousMonthButton =
  document.getElementById(
    "prev-month"
  );


if (
  previousMonthButton
) {

  previousMonthButton.addEventListener(
    "click",
    () => {

      Grid.goToPrevMonth();

      updateDashboard();

    }
  );

}


const nextMonthButton =
  document.getElementById(
    "next-month"
  );


if (
  nextMonthButton
) {

  nextMonthButton.addEventListener(
    "click",
    () => {

      Grid.goToNextMonth();

      updateDashboard();

    }
  );

}


/* =========================================================
   START APP
========================================================= */

applyAppSettings();

seedTestHabitsIfEmpty();

Grid.render();

updateDashboard();

addStatsButton();

addSettingsButton();

addHabitButton();


/* =========================================================
   DEBUG / READY
========================================================= */

console.log(
  "Habit Tracker loaded successfully."
);
