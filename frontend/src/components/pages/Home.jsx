import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminDashboard from "./adminDashboard";
import UserDashboard from "./userDashboard"; // make sure this exists

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // added state for role

  useEffect(() => {
    // Check if token and role exist in localStorage
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login"); // redirect to login page after logout
  };

  return (
    <>
      <nav className="bg-fuchsia-700 text-white py-6 shadow-md font-mono">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Ahalya Traders</Link>

          {isLoggedIn ? (
            <div className="flex flex-row gap-4">
              <img
                src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <button
                onClick={handleLogout}
                className="hover:text-gray-200 bg-white p-2 text-fuchsia-700 rounded"
              >
                Logout &rarr;
              </button>
            </div>
          ) : (
            <div className="space-x-6">
              <Link to="/login" className="hover:text-gray-200 bg-white p-2 text-fuchsia-700 rounded">Login</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Conditionally render dashboards based on role */}
      {isLoggedIn ? (
        role === "user" ? (<UserDashboard />) : <AdminDashboard />
      ) : (
        <div className="flex flex-col md:flex-row h-screen">

          <div className="md:w-1/2 flex flex-col justify-center items-center text-center px-6 bg-fuchsia-50">
            <h1 className="text-4xl font-bold text-fuchsia-700 mb-4 font-mono">
              Welcome to Ahalya Traders
            </h1>
            <p className="text-lg text-gray-600 mb-6 font-mono">
              Manage your business effortlessly — track inventory, sales, and reports all in one place.
            </p>
            <Link
              to="/login"
              className="bg-fuchsia-700 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-800 transition"
            >
              Get Started
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center items-center bg-fuchsia-100">
            <img
              src="\bg.avif"
              alt="Ahalya Traders"
              className="w-3/4 md:w-full h-screen object-cover"
            />
          </div>
        </div>



      )}
    </>
  );
};

export default Home;
