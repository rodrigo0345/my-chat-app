import React from 'react'
import { useEffect } from 'react';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { Link } from 'react-router-dom';

export default function Settings() {
    
    const { getSavedData, saveData } = useLocalStorage();


    function toggleDarkMode(e){
        const checked = e.target.value;
        const website = document.querySelector('body');

        if(checked){
            website.classList.add('dark');
            saveData('darkMode', true);
            return;
        }

        website.classList.remove('dark');
    }

    useEffect(() => {
        const darkMode = getSavedData('darkMode');
        darkMode? document.querySelector('#toggle-dark-mode').checked = true : document.querySelector('#toggle-dark-mode').checked = false;
    }, []);

  return (
    <>
        <div className='card'>
            <h1>Settings</h1>
            <div className="form-control enable-dark-mode">
                <label for="toggle-dark-mode">Enable Dark Mode</label>
                <input type="checkbox" id="toggle-dark-mode"
                onClick={toggleDarkMode}
                />
            </div>
        </div>
        <div className="cancel">
            <Link to="/">
                Cancel
            </Link>
        </div>
    </>
    
  )
}
