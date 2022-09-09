import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";

function Routing() {
  return (
    
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: "450px"}}>
            <Router>
              <AuthProvider>
                  <Routes>
                    <Route exact path="/" element={<Dashboard />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
              </AuthProvider>
            </Router>
          </div>
      </Container>
    
  );
}

export default Routing;