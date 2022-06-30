import React, { Component, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import { Grid, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

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

const PopulateGames = () => {
  let out = [];
  for (let i = 0; i < games.length; i++) {
    out.push(
      <SwiperSlide>
        <Link
          to={{
            pathname: "/" + games[i][0],
          }}>
          <div className="" key={games[i][1]}><h1 className="neon smaller">{games[i][0]}</h1></div>
        </Link>
      </SwiperSlide>)
  }
  return out
}
{/* <img className="game-picture" src= {games[i][0] + ".png"} /> */}

function Game() {
  return(
    <div className="game-container">
      <Swiper
       slidesPerView={3}
       grid={{
         rows: 2,
       }}
       spaceBetween={30}
       pagination={{
         clickable: true,
       }}
       modules={[Grid, Pagination]}
       className="swiper"
     >
       {PopulateGames()}
     </Swiper>
    </div>
  );
}
export default Game;
