import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const ConeManager = () => {
  const [cones, setCones] = useState([]);
  const [color, setColor] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [editingConeId, setEditingConeId] = useState(null);
  const [error, setError] = useState("");

  const fetchCones = async () => {
    try {
      const res = await axios.get("https://billing-software-4dft.onrender.com/cones");
      setCones(res.data);
    } catch (err) {
      setError("Failed to fetch cones.");
    }
  };

  useEffect(() => {
    fetchCones();
  }, []);

  const handleAddCone = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://billing-software-4dft.onrender.com/cones", {
        color,
        availableQuantity: Number(availableQuantity),
      });
      setColor("");
      setAvailableQuantity("");
      fetchCones();
    } catch (err) {
      setError("Failed to add cone.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://billing-software-4dft.onrender.com/cones/${id}`);
      fetchCones();
    } catch (err) {
      setError("Failed to delete cone.");
    }
  };

  const handleEdit = (cone) => {
    setEditingConeId(cone._id);
    setColor(cone.color);
    setAvailableQuantity(cone.availableQuantity);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://billing-software-4dft.onrender.com/cones/${editingConeId}`, {
        color,
        availableQuantity: Number(availableQuantity),
      });
      setEditingConeId(null);
      setColor("");
      setAvailableQuantity("");
      fetchCones();
    } catch (err) {
      setError("Failed to update cone.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-fuchsia-100 flex flex-col items-center py-10 font-mono">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Cone Management</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={editingConeId ? handleUpdate : handleAddCone} className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Cone Color"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Available Quantity"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700 transition"
            >
              {editingConeId ? "Update" : "Add"}
            </button>
          </form>

          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-fuchsia-200">
                <th className="p-2 border">Color</th>
                <th className="p-2 border">Available Quantity</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cones.map((cone) => (
                <tr key={cone._id} className="border-t">
                  <td className="p-2 border">{cone.color}</td>
                  <td className="p-2 border">{cone.availableQuantity}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(cone)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cone._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {cones.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No cones available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ConeManager;
