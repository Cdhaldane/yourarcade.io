import Sidebar from "../Components/Sidebar"
import Game from "../Components/Game"
import React, { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";


function About() {

  useEffect(() => {
    let audio = document.getElementById("myaudio");
    if(audio){
        audio.volume = 0.2;
    }
  })

  function handleMute() {
    let audio = document.getElementById("myaudio");
    if(audio){
      if(audio.volume === 0.2){
          audio.volume = 0.0;
      } else {
          audio.volume = 0.2;
      }
    }
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
        {/* <i class="fab fa-discord flux header-icon"></i> */}
        <i class="fas fa-volume-mute flux header-icon" onClick={() => handleMute()}></i>
        <Link to={{pathname: "/leaderboard",}}>
            <i class="fas fa-trophy flux header-icon"></i>
        </Link>
      </div>
      <audio autoPlay loop hidden id="myaudio">
        <source src="starwars.mp3" type="audio/mpeg"/>
      </audio>
      <div className="fade"></div>

      <section className="star-wars">
        <div className="crawl">
          <div className="title">
            <p>Episode X</p>
            <h1>A New Arcade</h1>
          </div>

          <p>A new arcade has invaded the empire, you must battle in the games to prove yourself worthy.</p>

            <p>All games are pure JavaScript and require two players, wait for an opponent to join or duplicate your tab to compete against yourself.</p>

          <p>Pursued by the Empire’s sinister agents, you must defeat the custodian of the stolen plans that can save your people and restore freedom to the galaxy….</p>
        </div>
      </section>

    </div>
  );
}
export default About;
