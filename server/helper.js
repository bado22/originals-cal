const getDay = require("date-fns/get_day"); // this gets day of the week. (i.e. 3 for wednesday)
const getDaysInMonth = require("date-fns/get_days_in_month");
const getYear = require("date-fns/get_year");
const getMonth = require("date-fns/get_month");
const getDate = require("date-fns/get_date");
const compareAsc = require("date-fns/compare_asc");

const monthToMonthLabel = num => {
  num = parseInt(num, 10);
  if (num === 1) return "January";
  if (num === 2) return "February";
  if (num === 3) return "March";
  if (num === 4) return "April";
  if (num === 5) return "May";
  if (num === 6) return "June";
  if (num === 7) return "July";
  if (num === 8) return "August";
  if (num === 9) return "September";
  if (num === 10) return "October";
  if (num === 11) return "November";
  if (num === 12) return "December";
  return null;
};

const dayToDayOfWeek = num => {
  if (num === 0) return "Sunday";
  if (num === 1) return "Monday";
  if (num === 2) return "Tuesday";
  if (num === 3) return "Wednesday";
  if (num === 4) return "Thursday";
  if (num === 5) return "Friday";
  if (num === 6) return "Saturday";
  return null;
};

const range = num => [...Array(num).keys()]; // goes from [0...n - 1]

const filterEventsForMonth = (year, month, events) => {
  const eventMatchesYearAndMonth = event =>
    getMonth(new Date(event.launch_date)) === month - 1 &&
    getYear(new Date(event.launch_date)) === year;

  return events.filter(eventMatchesYearAndMonth);
};

const makeDayObjsFromValidDays = (year, month, events) => {
  const makeDayObj = day => {
    day = day + 1;
    const dayOfWeek = getDay(new Date(year, month - 1, day));
    const dayOfWeekLabel = dayToDayOfWeek(dayOfWeek);
    return {
      day,
      events: [],
      dayOfWeek,
      dayOfWeekLabel
    };
  };

  return range(getDaysInMonth(new Date(`${year}-${month}-1`))).map(makeDayObj);
};

// TODO - THIS MUTATES ALLDAYS. MAKE IMMUTABLE.
// algorithm to add the events to the days.
const getDaysAndEventsTogether = (year, month, allDays, events) => {
  const lastDay = allDays[allDays.length - 1].day;
  let dayPointer = 1;
  let eventPointer = 0;

  while (eventPointer <= events.length - 1 && dayPointer <= lastDay) {
    let dayIdx = dayPointer - 1;
    const eventMatchesDay =
      getDate(new Date(events[0].launch_date)) === dayPointer;
    const eventMatchesMonth =
      getMonth(new Date(events[0].launch_date)) + 1 === month;

    if (eventMatchesDay && eventMatchesMonth) {
      const eventToAdd = events[eventPointer];
      allDays[dayIdx].events.push(eventToAdd);
      eventPointer += 1;
    } else {
      dayPointer += 1;
    }
  }

  return allDays;
};

// separate the weeks into a 2d array
const get2DWeeksReducer = (acc, curr) => {
  const isSunday = curr.dayOfWeek === 0;
  const lastArrayIdx = acc.length - 1;

  if (!acc.length || isSunday) {
    acc.push([curr]);
  } else {
    acc[lastArrayIdx].push(curr);
  }
  return acc;
};

// add the shadow days where they belong.
const addShadowDaysReducer = (acc, curr, idx, src) => {
  const firstArrIdx = 0;
  const lastArrIdx = src.length - 1;
  const isFirstArray = idx === firstArrIdx;
  const isLastArray = idx === lastArrIdx;
  const makeShadowDay = () => ({ shadowDay: true });
  if (isFirstArray) {
    const currentLength = curr.length;
    const daysToPrepend = 7 - currentLength;
    curr = range(daysToPrepend)
      .map(makeShadowDay)
      .concat(curr);
  } else if (isLastArray) {
    const currentLength = curr.length;
    const daysToAppend = 7 - currentLength;
    curr = curr.concat(range(daysToAppend).map(makeShadowDay));
  }
  acc.push(curr);
  return acc;
};

const addEventsToDays = (year, month, events) => {
  const allDays = makeDayObjsFromValidDays(year, month, events);

  return getDaysAndEventsTogether(year, month, allDays, events);
};

const getWeeks = (year, month, eventsData) => {
  const validEvents = filterEventsForMonth(year, month, eventsData);
  const sortedValidEvents = validEvents.sort(compareAsc);
  const daysWithEventsAdded = addEventsToDays(year, month, sortedValidEvents);
  const weeksWithEvents = turnDaysIntoWeeks(daysWithEventsAdded);

  return weeksWithEvents;
};

const turnDaysIntoWeeks = days =>
  days.reduce(get2DWeeksReducer, []).reduce(addShadowDaysReducer, []);

module.exports = {
  monthToMonthLabel,
  dayToDayOfWeek,
  range,
  filterEventsForMonth,
  addEventsToDays,
  turnDaysIntoWeeks,
  getWeeks
};
