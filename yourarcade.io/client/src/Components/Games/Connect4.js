import React, { Component, useState, useEffect } from 'react';
import io from 'socket.io-client';
import $ from "jquery";
import { Link } from "react-router-dom";

function Connect4() {
  const url = window.location.origin;
  let socket = io.connect(url);
  let curr = '';
  let myTurn = true,
    symbol;


  useEffect(() => {
      socket = io('localhost:5000');
      socket.on('connect', () => {
        console.log('socket connected');

      });

    }, []);

    useEffect(() => {
      socket.on("game.begin", function(data) {
        // The server will asign X or O to the player
        symbol = data.symbol;
        // Give X the first turn
        myTurn = symbol === "X";
        renderTurnMessage();
      });
      socket.on("move.made", function(data) {

        let move = getNextPosition(data.position);

        if(data.symbol === "X"){
          $("#" + move).text(data.symbol);
          $("#" + move).attr('class', "connect4-red");
        } else {
          $("#" + move).text(data.symbol);
          $("#" + move).attr('class', "connect4-yellow");
        }

        // If the symbol is the same as the player's symbol,
        // we can assume it is their turn
        myTurn = data.symbol !== symbol;

        // If the game is still going, show who's turn it is
        if (!isGameOver()) {
          renderTurnMessage();

          // If the game is over
        } else {
          // Show the message for the loser
          if (myTurn) {
            $("#messages4").text("Game over. You lost.");
            $("#messages4").attr('class', "game-over-lost");

            // Show the message for the winner
          } else {
            $("#messages4").text("Game over. You won!");
            $("#messages4").attr('class', "game-over-win");
          }

          // Disable the board
          $(".board4 button").attr("disabled", true);
        }
      });
      // Disable the board4 if the opponent leaves
      socket.on("opponent.left", function() {
        $("#messages4").text("Your opponent left the game.");
        $(".board4 button").attr("disabled", true);
      });

      $(function() {
        $(".board4 button").attr("disabled", true);
        $(".board4> button").on("click", makeMove);
      });
    });

  function getNextPosition(data){
    let number = data.slice(1)
    let letter = data.slice(0,1)
    let below;
    let out;
    let column = []
    var state = getBoardState()
    state = Object.keys(state).map((key) => [key, state[key]]);

    for(let i = 0; i < state.length; i++){
      if(state[i][0].includes(number)){
        column.push(state[i])
      }
    }
    for(let i = 0; i < column.length; i++){
      if(column[i][1] === ''){
        out = column[i]
      }
    }


    // below = String.fromCharCode(letter.charCodeAt(0) + i);
    // let n = below + number

    return out[0];
  }

  function getBoardState() {
    var obj = {};

    // We will compose an object of all of the Xs and Ox
    // that are on the board
    $(".board4 button").each(function() {
      obj[$(this).attr("id")] = $(this).text() || "";
    });
    return obj;
  }
  function isGameOver() {
    var state = getBoardState(),
    state = Object.keys(state).map((key) => [key, state[key]]);
    console.log(state)
    for(let i = 21; i < state.length; i++){
      if(state[i][1] === "X"){
        if(state[i-7][1] === "X" && state[i-14][1] === "X" && state[i-21][1] === "X"  ){
          return true
        }
        if(state[i-6][1] === "X" && state[i-12][1] === "X" && state[i-18][1] === "X" ){
          return true
        }
        if(state[i-8][1] === "X" && state[i-16][1] === "X" && state[i-24][1] === "X" ){
          return true
        }
      }
      if(state[i][1] === "O"){
        if(state[i-7][1] === "O" && state[i-14][1] === "O" && state[i-21][1] === "O"  ){
          return true
        }
        if(state[i-6][1] === "O" && state[i-12][1] === "O" && state[i-18][1] === "O" ){
          return true
        }
        if(state[i-8][1] === "O" && state[i-16][1] === "O" && state[i-24][1] === "O" ){
          return true
        }
      }
    }


    for(let i = 0; i < state.length; i++){
      if(state[i][1] === "X" && (state[i][0].includes("3") || state[i][0].includes("4") || state[i][0].includes("5"))){
        if(state[i-1][1] === "X" && state[i-2][1] === "X" && state[i-3][1] === "X" ){
          return true
        }
        if(state[i][1] === "O" && (state[i][0].includes("3") || state[i][0].includes("4") || state[i][0].includes("5"))){
          if(state[i-1][1] === "O" && state[i-2][1] === "O" && state[i-3][1] === "O" ){
            return true
          }
        }
      }
    }

  }

  function renderTurnMessage() {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
      $("#messages4").text("Your opponent's turn");
      $(".board4 button").attr("disabled", true);

      // Enable the board4 if it is your turn
    } else {
      $("#messages4").text("Your turn.");
      $(".board4 button").removeAttr("disabled");
    }
  }

  function makeMove(e) {
    e.preventDefault();

    // It's not your turn
    if (!myTurn) {
      return;
    }

    // The space is already checked
    if ($(this).text().length) {
      return;
    }

    // Emit the move to the server
    socket.emit("make.move", {
      symbol: symbol,
      position: $(this).attr("id")
    });
  }






  return(
    <div className="gamepage-container">
      <div className="grid">
        <div className="game-header flux game-align">
          <Link to={{pathname: "/",}}>
              <i class="fas fa-home flux header-icon"></i>
          </Link>
          <Link to={{pathname: "/about",}}>
              <i class="fas fa-info flux header-icon"></i>
          </Link>

          <div className="center">Connect4</div>
          <i class="fab fa-discord flux header-icon"></i>
          {/* <i class="fas fa-volume-mute flux header-icon" onClick={() => handleMute()}></i> */}
          <Link to={{pathname: "/leaderboard",}}>
              <i class="fas fa-trophy flux header-icon"></i>
          </Link>
        </div>

        <div className="board4">
          <button id="a0"></button> <button id="a1"></button> <button id="a2"></button>
          <button id="a3"></button> <button id="a4"></button> <button id="a5"></button> <button id="a6"></button>

          <button id="b0"></button> <button id="b1"></button> <button id="b2"></button>
          <button id="b3"></button> <button id="b4"></button> <button id="b5"></button> <button id="b6"></button>

          <button id="c0"></button> <button id="c1"></button> <button id="c2"></button>
          <button id="c3"></button> <button id="c4"></button> <button id="c5"></button> <button id="c6"></button>

          <button id="d0"></button> <button id="d1"></button> <button id="d2"></button>
          <button id="d3"></button> <button id="d4"></button> <button id="d5"></button> <button id="d6"></button>

          <button id="e0"></button> <button id="e1"></button> <button id="e2"></button>
          <button id="e3"></button> <button id="e4"></button> <button id="e5"></button> <button id="e6"></button>

          <button id="f0"></button> <button id="f1"></button> <button id="f2"></button>
        <button id="f3"></button> <button id="f4"></button> <button id="f5"></button> <button id="f6"></button>


        <div id="messages4">Waiting for opponent to join...</div>
        </div>
      </div>
    </div>
  );
}
export default Connect4;
