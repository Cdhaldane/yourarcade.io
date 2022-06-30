import Sidebar from "../Components/Sidebar"
import Game from "../Components/Game"
import React, { Component, useState, useEffect } from 'react';
import { Link } from "react-router-dom";


function Home() {

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
      {/* <Sidebar /> */}
      <div className="background-container" >
        <audio autoPlay loop hidden id="myaudio">
          <source src="background.mp3" type="audio/mpeg"/>
        </audio>

        <Game />
      </div>
    </div>
  );
}
export default Home;
