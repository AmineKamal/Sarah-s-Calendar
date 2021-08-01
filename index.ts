// Import stylesheets
import './style.css';

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER'
] as const;

type Month = typeof MONTHS[number];

const today = new Date();

function daysInMonth(month: Month, year: number) {
  return new Date(year, MONTHS.indexOf(month) + 1, 0).getDate();
}

function loadMonth(month: Month, year: number) {
  const numberOfDays = daysInMonth(month, year);
  const initialDay = new Date(year, MONTHS.indexOf(month), 1).getDay();

  document.getElementById('calendar-month').innerHTML = month;
  document.getElementById('calendar-year').innerHTML = year.toString();

  const calendarDaysElement = document.getElementById('calendar-days');
  calendarDaysElement.innerHTML = '';

  let daysElementInnerHTML = '';

  let elementCount = 0;

  for (let i = 0; i < initialDay; i++) {
    daysElementInnerHTML += '<li></li>\n';
    elementCount++;
  }

  const days = calculateSarahCycle(month, year);

  for (let i = 1; i <= numberOfDays; i++) {
    const date = new Date(year, MONTHS.indexOf(month), i);
    const td = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const active = date.getTime() === td.getTime() ? ' active' : '';

    if (days.find(d => d.getTime() === date.getTime())) {
      if (date.getDay() === 2 || date.getDay() === 3 || date.getDay() === 4) {
        daysElementInnerHTML += `<li class="danger${active}">${i}</li>\n`;
      } else {
        daysElementInnerHTML += `<li class="warning${active}">${i}</li>\n`;
      }
      elementCount++;
      continue;
    }

    daysElementInnerHTML += `<li class="${active}">${i}</li>\n`;
    elementCount++;
  }

  while (elementCount % 7 !== 0) {
    daysElementInnerHTML += '<li></li>\n';
    elementCount++;
  }

  calendarDaysElement.innerHTML = daysElementInnerHTML;
}

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function update() {
  loadMonth(MONTHS[currentMonth], currentYear);
}

function nextMonth() {
  currentMonth++;

  if (currentMonth >= MONTHS.length) {
    currentMonth = 0;
    currentYear++;
  }

  update();
}

function previousMonth() {
  currentMonth--;

  if (currentMonth < 0) {
    currentMonth = MONTHS.length - 1;
    currentYear--;
  }

  update();
}

function calculateSarahCycle(month: Month, year: number) {
  const firsDayOfMonth = new Date(year, MONTHS.indexOf(month), 1);

  const lastDayOfMonth = new Date(
    year,
    MONTHS.indexOf(month),
    daysInMonth(month, year)
  );

  let refWeekStart = new Date(2021, 7, 8);

  const dates: Date[] = [];

  if (refWeekStart > lastDayOfMonth) {
    // Go backward

    while (refWeekStart >= firsDayOfMonth) {
      refWeekStart.setDate(refWeekStart.getDate() - 28);

      for (let i = 0; i < 7; i++) {
        const date = new Date(refWeekStart);
        date.setDate(refWeekStart.getDate() + i);
        dates.push(date);
      }
    }

    return dates.filter(d => d >= firsDayOfMonth && d <= lastDayOfMonth);
  }

  // In case the ref is in the wanted month
  if (refWeekStart >= firsDayOfMonth) {
    for (let i = 0; i < 7; i++) {
      const date = new Date(refWeekStart);
      date.setDate(refWeekStart.getDate() + i);
      dates.push(date);
    }
  }

  while (refWeekStart <= lastDayOfMonth) {
    refWeekStart.setDate(refWeekStart.getDate() + 28);

    for (let i = 0; i < 7; i++) {
      const date = new Date(refWeekStart);
      date.setDate(refWeekStart.getDate() + i);
      dates.push(date);
    }
  }

  return dates.filter(d => d >= firsDayOfMonth && d <= lastDayOfMonth);
}

document
  .getElementById('previous-month')
  .addEventListener('click', previousMonth);

document.getElementById('next-month').addEventListener('click', nextMonth);

update();
