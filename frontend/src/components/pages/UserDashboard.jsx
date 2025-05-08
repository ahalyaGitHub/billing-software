import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function UserDashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Fetch user details from backend using _id
        axios.get(`http://localhost:5000/user/${userId}`)
          .then((res) => {
            setUserName(res.data.user_name);
          })
          .catch((err) => {
            console.error("Failed to fetch user details", err);
          });

      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center bg-fuchsia-100 font-mono px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome, <span className="text-fuchsia-800">{userName}</span>!
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Ahalya Traders — Digital Billing System
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl">
          Effortlessly manage your thread cone orders, track sales, and verify bill history with our
          seamless, digital-first billing solution.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">

          <Link to="/user-bill">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              📝 View Bills
            </button>
          </Link>
          <Link to="/user-analysis">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              📈 Dashboard Overview
            </button>
          </Link>
          <Link to="/user-cone" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 bg-fuchsia-600 text-white rounded-lg shadow-md hover:bg-fuchsia-700 transition-all duration-200">
              🧵 Current Cone Stock
            </button>
          </Link>
        </div>
      </div>

    </>
  );
}

export default UserDashboard;
