const express = require("express");
const events = require("./events.json");
const helper = require("./helper");
const port = 3002;
const app = express();

app.get("/api/calendar/month/:year/:month", (req, res) => {
  // TODO - Verify that year & month are valid here at the api level like is done clientside.
  let { year, month } = req.params;
  const strToInt = str => parseInt(str, 10); // params are strings. change to int.
  year = strToInt(year);
  month = strToInt(month);

  const weeks = helper.getWeeks(year, month, events.data);
  res.json({
    weeks,
    title: `${helper.monthToMonthLabel(month)} ${year}`
  });
});

const server = app.listen(port, error => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`Server listening on port ${server.address().port}`);
});
