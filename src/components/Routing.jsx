import React, {useEffect} from "react";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Profile from "./Profile";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Chat from "./Chat";
import MsgProvider from "../contexts/MsgContext";
import NewUser from "./NewUser";
import NewChat from "./NewChat";
import Settings from "./Settings";
import styled from "styled-components";
import '../styles/Routing.css'
import { useLocalStorage } from '../contexts/LocalStorageContext';

const Background = styled.div`
`;

function Routing() {

  const { getSavedData } = useLocalStorage();

  useEffect(() => {
    const checkDarkMode = getSavedData('darkMode');
    checkDarkMode? document.querySelector('body').classList.add('dark') : document.querySelector('body').classList.remove('dark');
  }, []);

  return (
    
      <div>
          <Background style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          height: `${window.innerHeight}px`}} id="background">
            <Router>
              <AuthProvider>
                    <Routes>
                      <Route exact path={"/" || "/chat"} element=
                        {
                          <PrivateRoute>
                            <MsgProvider>
                              <Chat />
                            </MsgProvider>
                          </PrivateRoute>
                        } />
                      <Route exact path="/profile" element=
                      {
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } />
                      <Route path="/update-profile" element=
                      {
                        <PrivateRoute>
                          <UpdateProfile />
                        </PrivateRoute>
                      } />
                      <Route exact path="/new-user" element=
                      {
                        <PrivateRoute newUser={true}>
                          <NewUser />
                        </PrivateRoute>
                      } />
                      <Route exact path={"/new-chat"} element=
                        {
                          <PrivateRoute>
                            <MsgProvider>
                              <NewChat />
                            </MsgProvider>
                          </PrivateRoute>
                        } />
                        <Route exact path={"/settings"} element=
                        {
                          <PrivateRoute>
                              <Settings />
                          </PrivateRoute>
                        } />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Routes>
              </AuthProvider>
            </Router>
          </Background>
      </ div>
    
  );
}

export default Routing;
