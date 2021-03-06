import React, { Component, useState, useEffect } from 'react';
import io from 'socket.io-client';
import $ from "jquery";
import { Link } from "react-router-dom";

function TicTacToe() {
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
        console.log(symbol)
        renderTurnMessage();
      });
      socket.on("move.made", function(data) {
        // Render the move
        $("#" + data.position).text(data.symbol);
        $("#" + data.position).attr('class', data.symbol);
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
            $("#messages").text("Game over. You lost.");
            $("#messages").attr('class', "game-over-lost");

            // Show the message for the winner
          } else {
            $("#messages").text("Game over. You won!");
            $("#messages").attr('class', "game-over-win");
          }

          // Disable the board
          $(".board button").attr("disabled", true);
        }
      });
      // Disable the board if the opponent leaves
      socket.on("opponent.left", function() {
        $("#messages").text("Your opponent left the game.");
        $(".board button").attr("disabled", true);
      });

      $(function() {
        $(".board button").attr("disabled", true);
        $(".board> button").on("click", makeMove);
      });
    });

  function getBoardState() {
    var obj = {};

    // We will compose an object of all of the Xs and Ox
    // that are on the board
    $(".board button").each(function() {
      obj[$(this).attr("id")] = $(this).text() || "";
    });
    return obj;
  }
  function isGameOver() {
    var state = getBoardState(),
      // One of the rows must be equal to either of these
      // value for
      // the game to be over
      matches = ["XXX", "OOO"],
      // These are all of the possible combinations
      // that would win the game
      rows = [
        state.a0 + state.a1 + state.a2,
        state.b0 + state.b1 + state.b2,
        state.c0 + state.c1 + state.c2,
        state.a0 + state.b1 + state.c2,
        state.a2 + state.b1 + state.c0,
        state.a0 + state.b0 + state.c0,
        state.a1 + state.b1 + state.c1,
        state.a2 + state.b2 + state.c2
      ];

    // Loop over all of the rows and check if any of them compare
    // to either 'XXX' or 'OOO'
    for (var i = 0; i < rows.length; i++) {
      if (rows[i] === matches[0] || rows[i] === matches[1]) {
        return true;
      }
    }
  }

  function renderTurnMessage() {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
      $("#messages").text("Your opponent's turn");
      $(".board button").attr("disabled", true);

      // Enable the board if it is your turn
    } else {
      $("#messages").text("Your turn.");
      $(".board button").removeAttr("disabled");
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

          <div className="center">TicTacToe</div>
          <i class="fab fa-discord flux header-icon"></i>
          {/* <i class="fas fa-volume-mute flux header-icon" onClick={() => handleMute()}></i> */}
          <Link to={{pathname: "/leaderboard",}}>
              <i class="fas fa-trophy flux header-icon"></i>
          </Link>


        </div>

        <div className="board">
          <button id="a0"></button> <button id="a1"></button> <button id="a2"></button>
          <button id="b0"></button> <button id="b1"></button> <button id="b2"></button>
          <button id="c0"></button> <button id="c1"></button> <button id="c2"></button>
          <div id="messages">Waiting for opponent to join...</div>
        </div>
      </div>
    </div>
  );
}
export default TicTacToe;
