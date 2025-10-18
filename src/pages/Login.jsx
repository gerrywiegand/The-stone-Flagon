import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    login();
    navigate("/drinks");
  }

  return (
    <div>
      <h2>Admin Login</h2>
      <button onClick={handleLogin}>Enter Admin Mode</button>
    </div>
  );
}
