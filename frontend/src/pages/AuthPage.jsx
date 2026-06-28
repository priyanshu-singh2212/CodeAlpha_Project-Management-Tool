import "./AuthPage.css";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {

 const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (!isLogin) {

            if (password !== confirmPassword) {
                return alert("Passwords do not match");
            }
const res = await api.post("/auth/register", {
  name,
  email,
  password
});



setMessage(res.data.message);

sessionStorage.setItem("token", res.data.token);

setTimeout(() => {
  navigate("/dashboard");
}, 2000);

}

        else {

            const res = await api.post("/auth/login", {
                email,
                password
            });
              console.log("LOGIN RESPONSE =", res.data);
            sessionStorage.setItem("token", res.data.token);
            console.log("TOKEN AFTER SAVE =", sessionStorage.getItem("token"));
            navigate("/dashboard");

        }

    }

    catch (error) {

        alert(
            error.response?.data?.message || "Something went wrong"
        );

    }

};
  return (
    <div className="auth-container">

      <div className="auth-box">

        <h2>{isLogin ? "Login" : "Register"}</h2>
{message && (
  <p style={{ color: "green", textAlign: "center" }}>
    {message}
  </p>
)}
<form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>

        </form>

        <p>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "blue",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

      </div>

    </div>
  );
}

export default AuthPage;