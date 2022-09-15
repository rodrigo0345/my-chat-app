import React, {useState, useRef} from 'react'
import { Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/newChat/newChat.css";
import { useAuth } from '../contexts/AuthContext'
import { useMsg } from '../contexts/MsgContext';
import uniqid from 'uniqid';

export default function NewChat() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userResults, setUserResults] = useState([]);
    const { retrieveUsers, retrieveAllUsers } = useAuth();
    const { savePhotoOnServer, addChat } = useMsg();
    const [usersChecked, setUsersChecked] = useState([]);
    const searchRef = useRef();
    const nameRef  = useRef();
    const imageRef = useRef();
    const navigate = useNavigate();
    
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
                        <input type="checkbox" name={user.data().displayName} id={user.id} onClick={addOrRemoveUser}/>
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

    async function submitNewChat(e){
        e.preventDefault();

        const chatName = nameRef.current.value;
        const chatImage = imageRef.current.files[0];
        const users = usersChecked;
        const uniqId = uniqid();

        if(chatName === '' || chatImage === undefined || users.length === 0){
            setError('Please fill all the fields');
            return;
        }
        
        setError('');
        setLoading(true);

        try{
            //currentUser.uid, 'geral', image
            const imageUrl = await savePhotoOnServer('chat-image', uniqId, chatImage);
            console.log(imageUrl)
            const something = await addChat(uniqId, chatName, users, imageUrl);
            navigate('/');
        }
        catch(msg){
            console.warn(msg.message);
            setError('Failed to create chat')
        }
        setLoading(false);
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
                <form onSubmit={submitNewChat}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" ref={nameRef} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <input type="file" accept="image/*" ref={imageRef} className="form-control" />
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
                        <label>Chosen Users</label>
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
