import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { fakeLogin } from "../../services/userService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";


const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        login(data.fullName, email, data.token);

        toast.success("Login successful!");
        navigate("/products", { replace: true});
      } else {
        toast.error(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };
   return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default Login;