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
      icon: "control",
    },
    {
      icon: "notes",
    },
    {
      icon: "graph",
    },
    {
      icon: "cog",
    },
    {
      icon: "control",
    },
    {
      icon: "notes",
    },
  ];

function Sidebar() {
  return(
    <div className="sidebar-container">
      <div>
        <div className="circle"><h1>AHH</h1></div>
        {links.map((icon) => (
            <div className="circle"><h1>User</h1></div>
        ))}
      </div>

    </div>
  );
}
export default Sidebar;
