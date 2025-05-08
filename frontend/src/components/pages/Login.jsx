import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const Login = () => {
  const [role, setRole] = useState("admin"); // default to admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint =
      role === "admin"
        ? "http://localhost:5000/admin/login"
        : "http://localhost:5000/user/login";

    try {
      const res = await axios.post(endpoint, { email, password });
      if (res.data) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        navigate("/"); // Redirect to dashboard
      }
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center bg-fuchsia-100 font-mono">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-600">Select Role</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
           
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
