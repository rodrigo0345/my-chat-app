import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter as Router, Routes , Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";

function Routing() {

  return (
    
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: "450px"}}>
            <Router>
              <AuthProvider>
                  <Routes>
                    <Route exact path="/" element=
                    {
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                  </Routes>
              </AuthProvider>
            </Router>
          </div>
      </Container>
    
  );
}

export default Routing;
