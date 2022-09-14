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
                        <label htmlFor={user.uid}>
                            {user.data().displayName}
                        </label>
                        <input type="checkbox" name={user.data().displayName} id={user.uid}/>
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

    async function init(){
        try{
            const users = await retrieveAllUsers();
            let elem = [];
            users.forEach(user => {
                const element = (
                    <div className="option">
                        <label htmlFor={user.uid}>
                            {user.data().displayName}
                        </label>
                        <input type="checkbox" name={user.data().displayName} id={user.uid} on/>
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
                    <button disabled={loading} className="submit" type="submit">Create Room</button>
                </form>
            </div>
        </div>
        <Link to='/'>Cancel</Link>
    </>
  )
}
