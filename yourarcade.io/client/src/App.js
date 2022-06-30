import './App.css';

import Footer from "./Views/Footer.js"
import Home from "./Views/Home"
import About from "./Views/About"
import Leaderboard from "./Views/Leaderboard"

import TicTacToe from "./Components/Games/TicTacToe.js"
import Tron from "./Components/Games/Tron.js"
import Phaser from "./Components/Games/Phaser.js"
import Connect4 from "./Components/Games/Connect4.js"
import Pinball from "./Components/Games/Pinball.js"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";



function App() {
  return (
    <div className="main-container">
    <Router>
      <div>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/About' element={<About/>}/>
          <Route exact path='/Leaderboard' element={<Leaderboard/>}/>
          <Route exact path='/TicTacToe' element={<TicTacToe/>}/>
          <Route exact path='/Tron' element={<Tron/>}/>
          <Route exact path='/Phaser' element={<Phaser />}/>
          <Route exact path='/Connect4' element={<Connect4 />}/>
          <Route exact path='/Game' element={<Pinball />}/>
        </Routes>
      </div>
    </Router>
    </div>

  );
}

export default App;

// <Sidebar />
// <Footer />
