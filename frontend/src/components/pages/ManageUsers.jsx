import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    user_name: '',
    company_name: '',
    email: '',
    phone: ''
  });
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://billing-software-4dft.onrender.com/user/');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error("Failed to fetch users.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://billing-software-4dft.onrender.com/user/${userId}`);
      toast.success("User deleted successfully.");
      fetchUsers();
      setDeleteUserId(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditFormData({
      user_name: user.user_name,
      company_name: user.company_name,
      email: user.email,
      phone: user.phone
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://billing-software-4dft.onrender.com/user/${editUserId}`, editFormData);
      toast.success("User updated successfully.");
      fetchUsers();
      setEditUserId(null);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-fuchsia-50 p-6 font-mono">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-fuchsia-800">👥 Manage Users</h1>
          <Link
            to="/customer-entry"
            className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700 transition"
          >
            ➕ Add Customer Entry
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-fuchsia-400 rounded px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded overflow-hidden">
            <thead className="bg-fuchsia-700 text-white">
              <tr>
                <th className="p-4 text-left">S.No</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-fuchsia-50">
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4">{user.user_name}</td>
                    <td className="p-4">{user.company_name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.phone || '—'}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 text-xl"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteUserId(user._id)}
                        className="text-red-600 hover:text-red-800 text-xl"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-mono">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-fuchsia-800">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="user_name"
                value={editFormData.user_name}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="company_name"
                value={editFormData.company_name}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Company"
                required
              />
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Phone"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUserId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-mono">
          <div className="bg-white rounded p-6 w-96 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-around">
              <button
                onClick={() => handleDelete(deleteUserId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteUserId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default ManageUsers;
