import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * /register now redirects to the unified AuthPage (Login.tsx).
 * The "Create an account" toggle lives inside that component.
 */
const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  return null;
};

export default Register;