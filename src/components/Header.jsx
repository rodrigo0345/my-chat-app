import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/header/header.css'
import styled from 'styled-components';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineUsergroupAdd, AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';


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

const Wrap = styled.div`
position: fixed;
height: 100%;
width: 100%;
top: 0;
left: 0;
backdrop-filter: blur(5px);
display: flex;
align-items: flex-start;
justify-content: flex-start;
z-index: 2000;
`;
const MobileMenu = styled.div`
    left: 0;
    z-index: 2001;
`;

export default function Header() {

  function showMobileMenu(e) {
    const menu = document.querySelector('.wrap-menu');
    menu.classList.remove('hidden');
  }

  function closeMobileMenu(e){
    e.stopPropagation();
    const menu = document.querySelector('.wrap-menu');
    menu.classList.add('hidden');
  }

  return (
    <div className="header">
      <HamMenu className="hamburguer" onClick={showMobileMenu}>
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
      <Wrap onClick={closeMobileMenu} className="wrap-menu hidden">
        <MobileMenu className="mobile-menu">
          <div className="profile-pic">
            <p>Our Chat</p>
            <AiOutlineCloseCircle onClick={closeMobileMenu}/>
          </div>
          <ul className="menu-items">
            <li className="menu-item">
              <Link to="/">
                <span>Chat</span>
                <BsFillChatDotsFill />
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/profile">
                <span>Profile</span>
                <CgProfile />
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/settings">
                <span>Settings</span> 
                <FiSettings />
              </Link>
            </li>
            <li className='menu-item'>
              <Link to="new-chat" className='new-chat'>
                <span>Create new chat</span>
                <AiOutlineUsergroupAdd id="icon"/>
              </Link>
            </li>
          </ul>
        </MobileMenu>
      </Wrap>
    </div>
  )
}
