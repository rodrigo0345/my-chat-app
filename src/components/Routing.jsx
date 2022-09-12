import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Profile from "./Profile";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter as Router, Routes , Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Chat from "./Chat";
import MsgProvider from "../contexts/MsgContext";
import NewUser from "./NewUser";
import styled from "styled-components";
import '../styles/Routing.css'

const Background = styled.div`
`;

function Routing() {

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
