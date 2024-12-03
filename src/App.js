import { useState } from "react";
import "./App.css";

function App() {
  const [tableCode, setTableCode] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const onTextareaChange = (event) => {
    setTableCode(event.target.value);
  };

  const parseHTMLTable = (htmlString) => {
    // Create a temporary DOM element to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Select the table
    const table = doc.querySelector("table");
    if (!table) {
      throw new Error("No table found in the provided HTML string.");
    }

    // Initialize an empty array for the result
    const tableArray = [];

    // Iterate over each row of the table
    table.querySelectorAll("tr").forEach((row) => {
      // Get the cells in the row
      const rowArray = [];
      row.querySelectorAll("th, td").forEach((cell) => {
        rowArray.push(cell.textContent.trim());
      });
      tableArray.push(rowArray);
    });

    return tableArray;
  };

  const parseTimeString = (timeString) => {
    if (typeof timeString !== "string") {
      throw new Error('Input must be a string in the format "hh.mm".');
    }

    const [hours, minutes] = timeString.split(".").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return {
        hours: 0,
        minutes: 0,
      };
    }

    return {
      hours,
      minutes,
    };
  };

  const sumTimeInMinutes = (timeArray) => {
    if (!Array.isArray(timeArray)) {
      throw new Error(
        'Input must be an array of objects with "hours" and "minutes" properties.'
      );
    }

    return timeArray.reduce((totalMinutes, time) => {
      if (typeof time.hours !== "number" || typeof time.minutes !== "number") {
        throw new Error(
          'Each object must have numeric "hours" and "minutes" properties.'
        );
      }

      return totalMinutes + time.hours * 60 + time.minutes;
    }, 0);
  };

  const convertMinutesToHoursMinutes = (totalMinutes) => {
    if (typeof totalMinutes !== "number" || isNaN(totalMinutes)) {
      throw new Error("Input must be a valid number.");
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = parseFloat((totalMinutes % 60).toFixed(2)); // Retain decimal precision if present

    return {
      hours,
      minutes,
    };
  };

  const calculateAverage = () => {
    const table = parseHTMLTable(tableCode);
    let hoursAndMinsArray = [];
    hoursAndMinsArray = table.map((elem) => {
      return parseTimeString(elem[10]);
    });
    hoursAndMinsArray = hoursAndMinsArray.filter(
      (elem) => !(elem.hours === 0 && elem.minutes === 0)
    );
    const minutes = sumTimeInMinutes(hoursAndMinsArray);
    const averagehoursminutes = minutes / hoursAndMinsArray.length;
    const averageHoursMinutes =
      convertMinutesToHoursMinutes(averagehoursminutes);
    setFinalMessage(
      `Your average time for the data provided is ${averageHoursMinutes.hours} hours and ${averageHoursMinutes.minutes}`
    );
  };
  return (
    <div className="container">
      <textarea
        value={tableCode}
        onChange={onTextareaChange}
        className="textbox"
      />
      <button onClick={calculateAverage}>Calculate average</button>
      <p>{finalMessage}</p>
    </div>
  );
}

export default App;
