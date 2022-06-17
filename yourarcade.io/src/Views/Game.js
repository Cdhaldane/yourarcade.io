import React, { Component, useState, useEffect } from 'react';


const links = [
    {
      icon: "game"
    },
    {
      icon: "chat",
    },
    {
      icon: "bell",
    },
    {
      icon: "users",
    },
    {
      icon: "graph",
    },
    {
      icon: "cog",
    },
    {
      icon: "cog",
    },

  ];

function Game() {
  return(
    <div className="game-container">
      <div className="game-grid">
        {links.map((icon) => (
            <div className="game-icon"><h1>User</h1></div>
        ))}
      </div>
    </div>
  );
}
export default Game;
