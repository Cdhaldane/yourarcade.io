import './App.css';

import Footer from "./Views/Footer.js"
import Sidebar from "./Views/Sidebar"
import Game from "./Views/Game"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";



function App() {
  return (
    <div className="main-container">
      <div className="header-container">
        <h1>yourarcade.io </h1>
      </div>
      <Sidebar />
      <div className="background-container">
        <Game />
      </div>
    </div>

  );
}

export default App;

// <Sidebar />
// <Footer />
