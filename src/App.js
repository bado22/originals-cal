import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CalendarRouter from "./CalendarRouter";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/calendar/:year/:month"
            component={CalendarRouter}
          />
        </div>
      </Router>
    );
  }
}

export default App;
