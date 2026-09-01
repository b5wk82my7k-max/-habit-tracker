const DateHelpers = {
  toKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },

  todayKey() {
    return this.toKey(new Date());
  },

  daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  dateKeyFor(year, month, day) {
    const m = String(month).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  },

  monthName(year, month) {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  },

  isToday(dateKey) {
    return dateKey === this.todayKey();
  },

  weekdayLetter(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  }
};
