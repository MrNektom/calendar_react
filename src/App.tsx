import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Calendar } from "./components/Calendar/Calendar";
import { EventsList } from "./components/EventsList/EventsList";

function App() {
  const [eventShow, setEventShow] = useState(-1);
  return (
    <div className="App">
      <Header />
      <div className="App__content">
        <EventsList eventShow={eventShow} onShowEvent={setEventShow} />
        <Calendar onShowEvent={setEventShow} />
      </div>
    </div>
  );
}

export default App;
