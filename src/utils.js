import getYear from "date-fns/get_year";
import getMonth from "date-fns/get_month";

const isValidDate = (year, month, day = 1) => {
  const strToInt = str => parseInt(str, 10);
  const isNum = num => /^\d+$/.test(num);
  if (!isNum(year) || !isNum(month) || !isNum(day)) {
    return false;
  }
  year = typeof year === "string" ? strToInt(year) : year;
  month = typeof month === "string" ? strToInt(month) : month;
  month -= 1; // do this b/c of how "new Date()" formats the month.
  const date = new Date(year, month, day);
  return getYear(date) === year && getMonth(date) === month;
};

const getPrevMonthAndYear = (currentMonth, currentYear) =>
  currentMonth === 1
    ? { month: 12, year: currentYear - 1 }
    : { month: currentMonth - 1, year: currentYear };

const getNextMonthAndYear = (currentMonth, currentYear) =>
  currentMonth === 12
    ? { month: 1, year: currentYear + 1 }
    : { month: currentMonth + 1, year: currentYear };

export { isValidDate, getPrevMonthAndYear, getNextMonthAndYear };
