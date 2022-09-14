import React, {useState, useRef} from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../styles/newChat/newChat.css";
import { useAuth } from '../contexts/AuthContext'

export default function NewChat() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userResults, setUserResults] = useState([]);
    const { retrieveUsers, retrieveAllUsers } = useAuth();
    const [usersChecked, setUsersChecked] = useState([]);
    const { searchRef } = useRef();
    
    async function filterResult(e){
    
        try{
            const search = e.target.value;

            if(search === ''){
                init();
                return;
            }
            const users =  await retrieveUsers(search);

            let elem = [];
            users.forEach(user => {
                const element = (
                    <div className="option">
                        <label htmlFor={user.id}>
                            {user.data().displayName}
                        </label>
                        <input type="checkbox" name={user.data().displayName} id={user.id}/>
                    </div>
                );
                elem.push(element);
            });
            setUserResults(elem);
        }
        catch(msg){
            console.warn(msg);
            setError('Failed to retrieve users')
        }
    }

    function activateDropdown(e){
        e.preventDefault();
        document.getElementById("myDropdown").classList.toggle("show");
    }

    function addOrRemoveUser(e){
        
        const userID = e.target.id;
        const userName = e.target.name;
        const checked = e.target.checked;

        if(checked){
            setUsersChecked(prev => [...prev, {id: userID, name: userName}]);
            return;
        }

        setUsersChecked(prev => prev.filter(user => user.id !== userID));
    }

    async function init(){
        try{
            const users = await retrieveAllUsers();
            let elem = [];
            users.forEach(user => {
                const element = (
                    <div className="option">
                        <label htmlFor={user.id}>
                            {user.data().displayName}
                        </label>
                        <input type="checkbox" name={user.data().displayName} id={user.id} onClick={addOrRemoveUser}/>
                    </div>
                );
                elem.push(element);
            });
            setUserResults(elem)
        }
        catch(msg){
            console.warn(msg);
            setError('Failed to retrieve users')
        }
    }

    
    React.useEffect(() => {
        init();
    }, [])

  return (
    <>
        { loading && <div className="loading-wrap">
                <div className="loading" /> 
            </div> }
        <div className="card">
            <div className="card-body">
                <h2 className="text-center mb-4">New Chat Room</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <input type="file" accept="image/*" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="myDropdown">Users</label>
                        <div className="dropdown">
                            <button 
                            onClick={activateDropdown}className='dropbtn'>Dropdown</button>
                            <div name="users" id="myDropdown" className='dropdown-content'>
                                <input type="text" placeholder='Search...' id="myInput" ref={searchRef} onChange={filterResult}/>
                                {userResults.length === 0? <a>No users found</a>:userResults}
                            </div>
                        </div>
                    </div>
                    <div className="form-group show-users">
                        <label>Users</label>
                        {usersChecked.map(user => <p>{user.name}</p>)}
                    </div>
                    <button disabled={loading} className="submit" type="submit">Create Room</button>
                </form>
            </div>
        </div>
        <Link to='/'>Cancel</Link>
    </>
  )
}
