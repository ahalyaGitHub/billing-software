import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const UserConePage = () => {
  const [cones, setCones] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("https://billing-software-4dft.onrender.com/cones")
      .then(res => {
        setCones(res.data);
        console.log(res.data);
      })
      .catch(() => setMessage("Failed to load cones"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 font-mono min-h-screen bg-gradient-to-br from-pink-100 to-indigo-100 ">
        <h2 className="text-3xl font-bold mb-8 text-center text-fuchsia-800">Available Cones</h2>

        {message && (
          <p className="text-center text-red-500 mb-4">{message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cones.map((cone) => (
            <div
              key={cone._id}
              className="flex items-center bg-white rounded shadow-md p-4 hover:shadow-fuchsia-300 transition"
            >
              <div
                className="w-16 h-16 rounded mr-6"
                style={{ backgroundColor: cone.color }}
              ></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {cone.color} Cone
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Available:</span> {cone.availableQuantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserConePage;
