import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/header/header.css'

export default function Header() {
  return (
    <div className="header">
      <div className="profile-pic">
        <p>Our Chat</p>
      </div>
      <ul className="menu">
        <li className="menu-item">
          <Link to="/">Chat</Link>
        </li>
        <li className="menu-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="menu-item">
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  )
}
