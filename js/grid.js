/* =========================================================
   HABIT TRACKER GRID
   Features:
   - Monthly calendar
   - Complete/uncomplete habits
   - Current streak
   - Best streak
   - Edit habit
   - Delete habit
========================================================= */

const Grid = {

  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,


  /* =======================================================
     RENDER GRID
  ======================================================= */

  render() {

    const title =
      document.getElementById("month-title");

    const gridEl =
      document.getElementById("grid");

    if (!gridEl) return;


    /* Month title */

    if (title) {
      title.textContent =
        DateHelpers.monthName(
          this.currentYear,
          this.currentMonth
        );
    }


    const habits =
      Storage.getHabits();


    gridEl.innerHTML = "";


    /* No habits */

    if (habits.length === 0) {

      gridEl.innerHTML = `
        <div class="empty-state">
          No habits yet. Add one to get started!
        </div>
      `;

      return;
    }


    const daysCount =
      DateHelpers.daysInMonth(
        this.currentYear,
        this.currentMonth
      );


    /* =====================================================
       HEADER
    ===================================================== */

    const headerRow =
      document.createElement("div");

    headerRow.className =
      "grid-header-row";


    const cornerCell =
      document.createElement("div");

    cornerCell.className =
      "habit-name-cell";

    cornerCell.textContent =
      "Habits";

    headerRow.appendChild(
      cornerCell
    );


    for (
      let day = 1;
      day <= daysCount;
      day++
    ) {

      const dateKey =
        DateHelpers.dateKeyFor(
          this.currentYear,
          this.currentMonth,
          day
        );


      const cell =
        document.createElement("div");


      cell.className =
        "day-header-cell" +
        (
          DateHelpers.isToday(dateKey)
            ? " today"
            : ""
        );


      cell.innerHTML = `
        ${day}<br>
        ${DateHelpers.weekdayLetter(
          this.currentYear,
          this.currentMonth,
          day
        )}
      `;


      headerRow.appendChild(cell);
    }


    gridEl.appendChild(
      headerRow
    );


    /* =====================================================
       SORT HABITS
    ===================================================== */

    const sortedHabits =
      [...habits].sort(
        (a, b) =>
          (a.sortOrder || 0) -
          (b.sortOrder || 0)
      );


    /* =====================================================
       HABIT ROWS
    ===================================================== */

    sortedHabits.forEach(
      habit => {

        const row =
          document.createElement("div");

        row.className =
          "grid-row";


        /* =================================================
           HABIT NAME CELL
        ================================================= */

        const nameCell =
          document.createElement("div");

        nameCell.className =
          "habit-name-cell";


        const nameWrapper =
          document.createElement("div");

        nameWrapper.style.cssText = `
          display:flex;
          align-items:center;
          gap:6px;
          width:100%;
          min-width:0;
        `;


        const nameText =
          document.createElement("span");

        nameText.style.cssText = `
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          flex:1;
          min-width:0;
        `;


        nameText.innerHTML = `
          <span class="icon">
            ${habit.icon || "✅"}
          </span>
          ${habit.name}
        `;


        /* =================================================
           EDIT BUTTON
        ================================================= */

        const editButton =
          document.createElement("button");

        editButton.textContent =
          "✏️";

        editButton.title =
          "Edit habit";


        editButton.style.cssText = `
          border:none;
          background:transparent;
          font-size:15px;
          padding:4px;
          flex-shrink:0;
          cursor:pointer;
        `;


        editButton.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            showHabitMenu(habit);

          }
        );


        nameWrapper.appendChild(
          nameText
        );

        nameWrapper.appendChild(
          editButton
        );

        nameCell.appendChild(
          nameWrapper
        );

        row.appendChild(
          nameCell
        );


        /* =================================================
           DAYS
        ================================================= */

        for (
          let day = 1;
          day <= daysCount;
          day++
        ) {

          const dateKey =
            DateHelpers.dateKeyFor(
              this.currentYear,
              this.currentMonth,
              day
            );


          const cell =
            document.createElement("div");


          cell.className =
            "day-cell" +
            (
              DateHelpers.isToday(dateKey)
                ? " is-today"
                : ""
            );


          const inner =
            document.createElement("div");


          const completed =
            Storage.isCompleted(
              habit.id,
              dateKey
            );


          inner.className =
            "day-cell-inner" +
            (
              completed
                ? " completed"
                : ""
            );


          inner.style.setProperty(
            "--habit-color",
            habit.color || "#3B82F6"
          );


          /* =================================================
             CLICK DAY
          ================================================= */

          inner.addEventListener(
            "click",
            () => {

              Storage.toggleCompletion(
                habit.id,
                dateKey
              );


              this.render();

              if (
                typeof updateDashboard ===
                "function"
              ) {
                updateDashboard();
              }

            }
          );


          cell.appendChild(
            inner
          );

          row.appendChild(
            cell
          );

        }


        /* =================================================
           ADD ROW
        ================================================= */

        gridEl.appendChild(
          row
        );

      }
    );

  },


  /* =======================================================
     PREVIOUS MONTH
  ======================================================= */

  goToPrevMonth() {

    this.currentMonth--;


    if (
      this.currentMonth < 1
    ) {

      this.currentMonth = 12;

      this.currentYear--;

    }


    this.render();


    if (
      typeof updateDashboard ===
      "function"
    ) {
      updateDashboard();
    }

  },


  /* =======================================================
     NEXT MONTH
  ======================================================= */

  goToNextMonth() {

    this.currentMonth++;


    if (
      this.currentMonth > 12
    ) {

      this.currentMonth = 1;

      this.currentYear++;

    }


    this.render();


    if (
      typeof updateDashboard ===
      "function"
    ) {
      updateDashboard();
    }

  }

};


/* =========================================================
   HABIT MENU
========================================================= */

function showHabitMenu(habit) {

  const overlay =
    document.createElement("div");


  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:4000;
    box-sizing:border-box;
  `;


  const modal =
    document.createElement("div");


  modal.style.cssText = `
    width:100%;
    max-width:340px;
    background:white;
    color:#1C1C1E;
    border-radius:20px;
    padding:22px;
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    text-align:center;
    box-sizing:border-box;
  `;


  modal.innerHTML = `

    <div style="
      font-size:32px;
      margin-bottom:8px;
    ">
      ${habit.icon || "✅"}
    </div>


    <h2 style="
      margin:0 0 6px;
      font-size:21px;
    ">
      ${habit.name}
    </h2>


    <p style="
      margin:0 0 20px;
      color:#8E8E93;
    ">
      What would you like to do?
    </p>


    <button id="edit-choice"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#3B82F6;
        color:white;
        font-size:16px;
        font-weight:600;
        margin-bottom:10px;
      ">
      ✏️ Edit Habit
    </button>


    <button id="delete-choice"
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
      ">
      🗑️ Delete Habit
    </button>


    <button id="cancel-choice"
      style="
        width:100%;
        padding:13px;
        border:none;
        border-radius:12px;
        background:#E5E5EA;
        color:#1C1C1E;
        font-size:16px;
      ">
      Cancel
    </button>

  `;


  overlay.appendChild(
    modal
  );

  document.body.appendChild(
    overlay
  );


  document
    .getElementById("edit-choice")
    .addEventListener(
      "click",
      () => {

        overlay.remove();

        showEditHabitModal(
          habit
        );

      }
    );


  document
    .getElementById("delete-choice")
    .addEventListener(
      "click",
      () => {

        overlay.remove();

        showDeleteHabitModal(
          habit
        );

      }
    );


  document
    .getElementById("cancel-choice")
    .addEventListener(
      "click",
      () => {

        overlay.remove();

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
   EDIT HABIT
========================================================= */

function showEditHabitModal(habit) {

  const overlay =
    document.createElement("div");


  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    z-index:4000;
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
    box-shadow:0 15px 40px rgba(0,0,0,0.25);
    box-sizing:border-box;
  `;


  const currentColor =
    habit.color || "#3B82F6";


  modal.innerHTML = `

    <h2 style="
      margin:0 0 20px;
      font-size:22px;
    ">
      Edit Habit
    </h2>


    <label style="
      display:block;
      margin-bottom:6px;
      font-weight:600;
    ">
      Habit name
    </label>


    <input
      id="edit-name"
      type="text"
      value="${escapeHTML(habit.name)}"
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
      id="edit-icon"
      type="text"
      value="${escapeHTML(habit.icon || "✅")}"
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
        id="edit-color"
        type="color"
        value="${currentColor}"
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
        id="edit-color-value"
        style="
          font-size:15px;
          color:#8E8E93;
        "
      >
        ${currentColor}
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
      id="edit-goal"
      type="number"
      value="${habit.monthlyGoal || 20}"
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
        id="edit-cancel"
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
        id="edit-save"
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
        Save
      </button>

    </div>

  `;


  overlay.appendChild(
    modal
  );

  document.body.appendChild(
    overlay
  );


  const colorInput =
    document.getElementById(
      "edit-color"
    );


  const colorValue =
    document.getElementById(
      "edit-color-value"
    );


  colorInput.addEventListener(
    "input",
    () => {

      colorValue.textContent =
        colorInput.value;

    }
  );


  document
    .getElementById("edit-cancel")
    .addEventListener(
      "click",
      () => overlay.remove()
    );


  document
    .getElementById("edit-save")
    .addEventListener(
      "click",
      () => {

        const name =
          document
            .getElementById("edit-name")
            .value
            .trim();


        const icon =
          document
            .getElementById("edit-icon")
            .value
            .trim() || "✅";


        const color =
          document
            .getElementById("edit-color")
            .value;


        const goal =
          Number(
            document
              .getElementById("edit-goal")
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


        Storage.updateHabit(
          habit.id,
          {
            name,
            icon,
            color,
            monthlyGoal: goal
          }
        );


        overlay.remove();


        Grid.render();


        if (
          typeof updateDashboard ===
          "function"
        ) {
          updateDashboard();
        }

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
   DELETE HABIT
========================================================= */

function showDeleteHabitModal(habit) {

  const confirmed =
    confirm(
      `Delete "${habit.name}"?\n\n` +
      `All completion records for this habit ` +
      `will also be deleted.`
    );


  if (!confirmed) {
    return;
  }


  Storage.deleteHabit(
    habit.id
  );


  Grid.render();


  if (
    typeof updateDashboard ===
    "function"
  ) {
    updateDashboard();
  }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
