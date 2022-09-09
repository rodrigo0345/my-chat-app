import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";

function Routing() {
  return (
    <AuthProvider>
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
          <div className="w-100" style={{maxWidth: "450px"}}>
              <Signup />
          </div>
      </Container>
    </AuthProvider>
  );
}

export default Routing;
