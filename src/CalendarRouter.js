import React from "react";
import { Redirect } from "react-router-dom";
import getYear from "date-fns/get_year";
import getMonth from "date-fns/get_month";
import Calendar from "./Calendar";
import { isValidDate } from "./utils";

const CalendarRouter = ({ match }) => {
  let { year, month } = match.params;

  if (!isValidDate(year, month)) {
    const currentYear = getYear(new Date());
    const currentMonth = getMonth(new Date()) + 1; // add 1 b/c of how "new Date()" deals w/dates.
    const currentMonthPath = `/calendar/${currentYear}/${currentMonth}`;
    return <Redirect to={currentMonthPath} />;
  } else {
    // params are always strings. Change to int.
    year = parseInt(year, 10);
    month = parseInt(month, 10);
  }

  return <Calendar year={year} month={month} />;
};

export default CalendarRouter;
