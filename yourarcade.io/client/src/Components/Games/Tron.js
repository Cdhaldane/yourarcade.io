import React, { Component, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import $ from "jquery";
import { Link } from "react-router-dom";

function Tron() {
  const url = window.location.origin;
  let socket = io.connect(url);
  const canvasRef = useRef(null);
  let ctx;
  let c;
  let key = 39;
  let w = 660; //ctx.canvas.clientWidth;
  let h = 510; //ctx.canvas.clientHeight;
  let speed = 0.4;
  let enemy = {};
  let enemyID;
  let pause = true;
  let storage = [];
  let player;
  let symbol = "O";


  useEffect(() => {
    socket = io('localhost:5000');
    socket.on('connect', () => {
      console.log('socket connected');
    });
    c = document.getElementById('canvas');
    ctx = c.getContext('2d');
    c.width = w;
    c.height = h;
    }, []);

    useEffect(() => {
      update()
    },[player])

  useEffect(() => {
    socket.on('connect', () => {
      reset();
    });
    socket.on('sync', function(data) {
      enemy = new Player();

      enemy.pos = new Vector(data[0]?.pos?.x, data[0]?.pos?.y)
      enemy.tail = [enemy.pos, enemy.pos]
      enemy.dir = Vector.right

      player.pos = new Vector(data[1]?.pos?.x, data[1]?.pos?.y)
      player.tail = [player.pos, player.pos]
      player.dir = Vector.right
    })
    socket.on('move_made', function(data) {
      if(symbol === "O" && data.symbol !== symbol){
        if(data.dir.y === 0.4){
          player.dir = Vector.down
        }
        if(data.dir.y === -0.4){
          player.dir = Vector.up
        }
        if(data.dir.x === 0.4){
          player.dir = Vector.right
        }
        if(data.dir.x === -0.4){
          player.dir = Vector.left
        }
        player.tail.push(data.pos);
      }
      if(symbol === "X" && data.symbol !== symbol){
        if(data.dir.y === 0.4){
          enemy.dir = Vector.down
        }
        if(data.dir.y === -0.4){
          enemy.dir = Vector.up
        }
        if(data.dir.x === 0.4){
          enemy.dir = Vector.right
        }
        if(data.dir.x === -0.4){
          enemy.dir = Vector.left
        }
        enemy.tail.push(data.pos);
      }
      })



    socket.on("game.begin", function(data) {
      // The server will asign X or O to the enemy
      symbol = data.symbol;
      pause = false;
      $("#tron-messages").text("Game on.");

    });
  },[])



  var Vector = function(x,y) {
    this.x = x;
    this.y = y;
  };

  Vector.left = new Vector(-speed, 0);
  Vector.up = new Vector(0, -speed);
  Vector.right = new Vector(speed, 0);
  Vector.down = new Vector(0, speed);

  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  var Player = function() {
    this.pos = new Vector(~~(Math.random()*(w-360)) + 50, ~~(Math.random()*(h-50)) + 50)
    //this.c = '#B60C48',//'#' + Math.floor(Math.random()*16777215).toString(16);
    this.dir = Vector.right;
    this.tail = [this.pos, this.pos];
  };



  function reset(){
    player = new Player();
    enemy = new Player();
    storage.push(player)
    storage.push(enemy)
    socket.emit('created', storage);
    storage=[]
    key = 39;
  }


  function line_intersects(v1, v2, v3, v4) {
      var s1_x, s1_y, s2_x, s2_y;
      s1_x = v2.x - v1.x;
      s1_y = v2.y - v1.y;
      s2_x = v4.x - v3.x;
      s2_y = v4.y - v3.y;
      var s, t;
      s = (-s1_y * (v1.x - v3.x) + s1_x * (v1.y - v3.y)) / (-s2_x * s1_y + s1_x * s2_y);
      t = ( s2_x * (v1.y - v3.y) - s2_y * (v1.x - v3.x)) / (-s2_x * s1_y + s1_x * s2_y);
      if (s > 0 && s <= 1 && t > 0 && t <= 1)
      {
        return true
      }
      return false;
  }

  // function point(x,y){
  //   ctx.fillRect(x,y,5,5);
  // }

  function line (tail, color) {
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(tail[0].x, tail[0].y);
    for (var i = 1; i < tail.length; i++) {
      ctx.lineTo(tail[i].x, tail[i].y);
    };
    ctx.stroke();
    ctx.closePath();
  }

  document.body.addEventListener("keydown", function (e) {
    if( Math.abs(e.keyCode - key) !== 2 ) {
      key = e.keyCode;
      if(symbol === "X"){
        switch(key) {
          case 37: //left
            player.dir = Vector.left;
            break;
          case 38: //up
            player.dir = Vector.up;
            break;
          case 39: //right
            player.dir = Vector.right;
            break;
          case 40: //down
            player.dir = Vector.down;
            break;
        }
        player.tail.push(player.pos);
        player.symbol = symbol;
        socket.emit("updater", player);
      }
      if(symbol === "O"){
        switch(key) {
          case 37: //left
            enemy.dir = Vector.left;
            break;
          case 38: //up
            enemy.dir = Vector.up;
            break;
          case 39: //right
            enemy.dir = Vector.right;
            break;
          case 40: //down
            enemy.dir = Vector.down;
            break;
        }
        enemy.symbol = symbol;
        enemy.tail.push(enemy.pos);
        socket.emit("updater", enemy);
      }

    }
  });

  let head; //?
  let heade;
  function update () {
    // socket.emit("updater", enemy)
    ctx.clearRect(0,0,w,h);

  if (!pause) {

    var parts = []
    for (var i = 0; i < player.tail.length - 1; i++) {
      parts.push([player.tail[i], player.tail[i+1]])
    };
    var eparts = []
    for (var i = 0; i < enemy.tail.length - 1; i++) {
      eparts.push([enemy.tail[i], enemy.tail[i+1]])
    };
    head = parts.pop();
    heade = eparts.pop();
    if(parts.length > 0){
      for (var i = 0; i < parts.length; i++) {
        if(line_intersects(head[0], head[1], parts[i][0], parts[i][1]) || line_intersects(heade[0], heade[1], parts[i][0], parts[i][1])){
          if(symbol === "X"){
            $("#tron-messages").text("Blue Wins");
          } else {
            $("#tron-messages").text("Red Wins");
          }
          pause = true
        }
      }
    }
    if(eparts.length > 0){
      for (var i = 0; i < eparts.length; i++) {
        if(line_intersects(heade[0], heade[1], eparts[i][0], eparts[i][1]) || line_intersects(head[0], head[1], eparts[i][0], eparts[i][1])){
          if(symbol === "O"){
            $("#tron-messages").text("Blue Wins");
          } else {
            $("#tron-messages").text("Red Wins");
          }
          pause = true
        }
      }
    }

    enemy.pos = Vector.add(enemy.pos, enemy.dir);
    enemy.tail[enemy.tail.length - 1] = enemy.pos;
    if(symbol === "O"){
        line(enemy.tail, '#B60C48');
    } else {
        line(enemy.tail, "#5271ff")
    }
    player.pos = Vector.add(player.pos, player.dir);
    player.tail[player.tail.length - 1] = player.pos;
    if(symbol === "X"){
        line(player.tail, '#B60C48');
    } else {
        line(player.tail, "#5271ff")
    }

    if(player.pos.x > w || player.pos.y > h || player.pos.x < 0 || player.pos.y < 0) {
      reset();

    }
    if(enemy.pos.x > w || enemy.pos.y > h || enemy.pos.x < 0 || enemy.pos.y < 0) {
      reset();

    }
  }

  requestAnimationFrame(update);

  }



  function renderTurnMessage() {
    // Disable the board if it is the opponents turn
      $("#tron-messages").text("Game On");

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

          <div className="center">Tron</div>
          <i class="fab fa-discord flux header-icon"></i>
          {/* <i class="fas fa-volume-mute flux header-icon" onClick={() => handleMute()}></i> */}
          <Link to={{pathname: "/leaderboard",}}>
              <i class="fas fa-trophy flux header-icon"></i>
          </Link>
        </div>
        <canvas id='canvas'></canvas>
      <div id="tron-messages">Waiting for opponent to join...</div>
      </div>
    </div>
  );
}
export default Tron;
