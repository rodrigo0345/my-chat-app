import React, {useRef, useState} from 'react'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const usernameRef = useRef();
    const imageRef = useRef();
    
    const { currentUser, registerUserDataInDatabase } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateUserInfo } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        let username, image;
        
        usernameRef.current?.value?
            username = usernameRef.current.value:
            username = currentUser.username;
        
        if (imageRef.current?.value) {
            image = imageRef.current.files[0];
        }
        else{
            setError("You must select an image");
            return;
        }

        try{
            setLoading(true);
            setError('');
            await updateUserInfo(currentUser.email, username, image);
            await registerUserDataInDatabase(username, currentUser.email, currentUser.uid);
            navigate('/');
        } catch(error) {
            setError("Failed to create account");
            console.warn(error);
        }

        setLoading(false);
    }

    function handleChange(e){
        // filter better this shit
    }

    return (
    <>
        { loading && <div className="loading-wrap">
                <div className="loading" /> 
            </div> }
        <div className="card">
            <div className="card-body">
                <h2 className="text-center mb-4">Create Profile</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" ref={usernameRef} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <input type="file" ref={imageRef} accept="image/*" className="form-control" onChange={handleChange} />
                    </div>
                    <button disabled={loading} className="submit" type="submit">Create Profile</button>
                </form>
            </div>
        </div>
    </>
    )
}
