import Sidebar from "../Components/Sidebar"
import Game from "../Components/Game"
import React, { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";


function About() {

  const games = [
    ["TicTacToe", 0],
    ["Connect4", 1],
    ["Tron", 2],
    ["Game", 3],
    ["Game", 4],
    ["Game", 5],
    ["Game", 6],
    ["Game", 7]
  ]

  function calculateButtons(){

    let out = [];
    for (let i = 0; i < games.length; i++) {
      out.push(
          <button className="leaderboard-buttons" key={games[i][1]}>{games[i][0]}</button>
        )
    }
    return out
  }

  return(
    <div className="home-container">
      <div className="header-container">
        <Link to={{pathname: "/",}}>
            <i class="fas fa-home flux header-icon"></i>
        </Link>
        <Link to={{pathname: "/about",}}>
            <i class="fas fa-info flux header-icon"></i>
        </Link>

        <div>
          <div class="neon">Your </div>
          <div class="flux">Arcade.io</div>
        </div>
        <i class="fab fa-discord flux header-icon"></i>
        <i class="fas fa-trophy flux header-icon"></i>
      </div>
      <div className="leaderboard-container">
        {calculateButtons()}
        <h1 className="flux center2">WORK IN PROGRESS</h1>
      </div>
    </div>
  );
}
export default About;
