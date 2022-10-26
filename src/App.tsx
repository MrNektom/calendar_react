import React from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Calendar } from "./components/Calendar/Calendar";
import { EventsList } from "./components/EventsList/EventsList";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="App__content">
        <EventsList />
        <Calendar />
      </div>
    </div>
  );
}

export default App;
