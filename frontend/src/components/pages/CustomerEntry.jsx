import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

const CustomerEntry = () => {
  const [user_name, setUserName] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCustomerEntry = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        user_name,
        company_name,
        email,
        password,
        phone,
        address
      });

      if (res.data) {
        alert("Customer entry successful!");
        navigate("/manage-users");  // redirect to user management after entry
      }
    } catch (err) {
      setError("Customer entry failed. Email might already be registered.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center bg-fuchsia-100 font-mono">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Customer Entry</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleCustomerEntry}>
            <div className="mb-3">
              <label className="block text-gray-600">User Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-600">Company Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-600">Phone</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-fuchsia-400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-fuchsia-600 text-white py-2 rounded-lg hover:bg-fuchsia-700 transition"
            >
              Add Customer Entry
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerEntry;
