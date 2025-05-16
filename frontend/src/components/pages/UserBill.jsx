import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";

const UserBillPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.get("https://billing-software-4dft.onrender.com/bills/userbills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBills(response.data.bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-fuchsia-100 flex items-center justify-center font-mono px-4 py-8">
        <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Your Bills</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading bills...</p>
          ) : bills.length > 0 ? (
            <table className="min-w-full text-left border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border">Company Name</th>
                  <th className="p-3 border">Phone No</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Items</th>
                  <th className="p-3 border">Overall Total</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-100">
                    <td className="p-3 border">{bill.company_name}</td>
                    <td className="p-3 border">{bill.phone_no}</td>
                    <td className="p-3 border">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-3 border">Colour</th>
                            <th className="p-3 border">Count</th>
                            <th className="p-3 border">Price per Cone</th>
                            <th className="p-3 border">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.thread_items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-3 border">{item.cone_colour}</td>
                              <td className="p-3 border">{item.cone_count}</td>
                              <td className="p-3 border">₹{item.price_per_cone}</td>
                              <td className="p-3 border">₹{item.total_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="p-3 border font-semibold">₹{bill.overall_total}</td>
                    <td className={`p-3 border font-bold ${bill.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                      {bill.status.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">No bills found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBillPage;
