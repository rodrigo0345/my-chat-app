import React from 'react'

const LocalStorageContext = React.createContext();

export function useLocalStorage(){
    return React.useContext(LocalStorageContext);
}

export function LocalStorageProvider({ children }) {
    const [loading, setLoading] = React.useState(false);

    function getSavedData(key){
        const savedData = localStorage.getItem(key);
        return JSON.parse(savedData);
    }

    function saveData(key, data){
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    const value = {
        getSavedData,
        saveData,
    }
    return (
        <LocalStorageContext.Provider value={value}>
            { !loading && children }
        </LocalStorageContext.Provider>
    )
}
