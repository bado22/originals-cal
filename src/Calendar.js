import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getPrevMonthAndYear, getNextMonthAndYear } from "./utils";
import PropTypes from "prop-types";
import "./Calendar.css";

const dayCell = day => {
  if (day.shadowDay) {
    return (
      <div className="date shadow-day" tabIndex="0">
        <p className="day">{day.day}</p>
      </div>
    );
  } else {
    return (
      <div key={day.day} className="date" tabIndex="0">
        <p className="day">{day.day}</p>
        {day.events.map(event => (
          <div key={event.id} className="event-title-wrapper">
            <a
              className="event-title"
              title={event.title}
              target="_blank"
              rel="noopener noreferrer"
              href={`http://www.netflix.com/${event.id}`}
            >
              {event.title}
            </a>
          </div>
        ))}
      </div>
    );
  }
};

const getWeeksDataP = (year, month) =>
  fetch(`/api/calendar/month/${year}/${month}`).then(data => data.json());

class EventCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = { weeks: [], title: "" };
  }

  refreshCalendarData(year, month) {
    getWeeksDataP(year, month).then(({ weeks, title }) => {
      this.setState({ weeks, title });
    });
  }

  componentDidMount() {
    this.refreshCalendarData(this.props.year, this.props.month);
  }

  componentDidUpdate(prevProps) {
    const monthOrYearChanged =
      this.props.month !== prevProps.month ||
      this.props.year !== prevProps.year;

    if (monthOrYearChanged) {
      this.refreshCalendarData(this.props.year, this.props.month);
    }
  }

  render() {
    const { month, year } = this.props;
    const prevMonth = getPrevMonthAndYear(month, year).month;
    const prevYear = getPrevMonthAndYear(month, year).year;
    const nextMonth = getNextMonthAndYear(month, year).month;
    const nextYear = getNextMonthAndYear(month, year).year;
    const prevLink = <Link to={`/calendar/${prevYear}/${prevMonth}`}>←</Link>;
    const nextLink = <Link to={`/calendar/${nextYear}/${nextMonth}`}>→</Link>;
    const headerStyles = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    };
    const headerContentStyles = {
      display: "flex",
      justifyContent: "space-between",
      width: "400px",
      color: "#B01D0C"
    };
    const mainStyles = {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap"
    };
    const weekStyles = { display: "flex" };

    return (
      <div>
        <header style={headerStyles}>
          <div style={headerContentStyles}>
            <span className="nav-arrow">{prevLink}</span>
            {<h1> {this.state.title} </h1>}
            <span className="nav-arrow">{nextLink}</span>
          </div>
        </header>

        <main style={mainStyles}>
          {/* insert {daysOfTheWeek} here with more time by doing [weekdays].map() */}
          {this.state.weeks.map(week => (
            <div key={Math.random()} style={weekStyles}>
              {/* Math.random() is bad practice. This was done in interest of time. */}
              {week.map(day => (
                <div key={Math.random()}> {dayCell(day)} </div>
              ))}
            </div>
          ))}
        </main>
      </div>
    );
  }
}

EventCalendar.propTypes = {
  month: PropTypes.number,
  year: PropTypes.number
};

export default EventCalendar;
