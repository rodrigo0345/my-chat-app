import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/header/header.css'
import styled from 'styled-components';
import { GiHamburgerMenu } from 'react-icons/gi';

const HamMenu = styled.div`
    height: 40px;
    width: 40px;
    padding: 0 10px;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (min-width: 768px){
      display: none;
    }
`;

export default function Header() {
  return (
    <div className="header">
      <HamMenu className="hamburguer">
        <GiHamburgerMenu />
      </HamMenu>
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
