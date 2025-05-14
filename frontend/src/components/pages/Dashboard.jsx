import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaFilePdf, FaDownload, FaCheck } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDownload = (bill) => {
    const doc = new jsPDF();
  
    // Title - Company Name
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Ahalya Traders", 105, 20, { align: "center" });
  
    // Address and Phone
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("44, Thilagar Nagar, 1st Street, Annuparpalayam, Tiruppur - 641652", 105, 30, { align: "center" });
    doc.text("Phone: 9585185379, 9943530075", 105, 38, { align: "center" });
  
    // Horizontal line separator
    doc.setDrawColor(160, 160, 160);
    doc.line(20, 45, 190, 45);
  
    // Bill Details
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text(`Bill To: ${bill.company_name}`, 20, 55);
    doc.text(`Total Amount: ₹${bill.overall_total.toFixed(2)}`, 20, 65);
    doc.text(`Status: ${bill.status}`, 20, 75);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);
    if (bill.bill_no) {
      doc.text(`Bill No: ${bill.bill_no}`, 150, 65);
    }
  
    // Table Columns & Rows
    const columns = [
      { header: "Shade", dataKey: "shade" },
      { header: "Count", dataKey: "count" },
      { header: "Price per Cone", dataKey: "price" },
      { header: "Total Price", dataKey: "total" }
    ];
  
    const rows = bill.thread_items.map(item => ({
      shade: item.cone_colour,
      count: item.cone_count,
      price: `₹${item.price_per_cone.toFixed(2)}`,
      total: `₹${(item.cone_count * item.price_per_cone).toFixed(2)}`
    }));
  
    // Table Styling
    autoTable(doc, {
      startY: 85,
      columns,
      body: rows,
      styles: {
        fontSize: 12,
        textColor: 50,
        cellPadding: 4,
        lineColor: [160, 160, 160],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [52, 152, 219], // blue header
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      columnStyles: {
        shade: { halign: "left" },
      },
      theme: "striped",
    });
  
    // Grand Total Row
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grand Total: ₹${bill.overall_total.toFixed(2)}`, 150, finalY, { align: "right" });
  
    // Save PDF
    doc.save(`Bill_${bill.company_name}.pdf`);
  };

  const [editBill, setEditBill] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    thread_items: [],
    overall_total: 0,
    status: "pending",
  });

  // Open the edit modal
  const handleEdit = (bill) => {
    setEditBill(bill._id);
    setFormData({
      company_name: bill.company_name,
      thread_items: bill.thread_items,
      overall_total: calculateTotal(bill.thread_items), // Calculate total here
      status: bill.status,
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.cone_count * item.price_per_cone, 0);
  };

  // Update bill in the backend
  const handleUpdateBill = async () => {
    try {
      await axios.put(`http://localhost:5000/bills/update/${editBill}`, formData);
      setBills(
        bills.map((bill) =>
          bill._id === editBill ? { ...bill, ...formData } : bill
        )
      );
      toast.success("Bill updated successfully.");
      setEditBill(null);
    } catch (error) {
      toast.error("Failed to update bill.");
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchBills = async () => {
      console.log("Searching for:", searchTerm);  // Debugging line
      try {
        const response = await axios.get(`http://localhost:5000/bills?search=${searchTerm}`);
        setBills(response.data.bills);
      } catch (error) {
        toast.error("Failed to fetch bills.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bills/delete/${id}`);
      setBills(bills.filter((bill) => bill._id !== id));
      toast.success("Bill deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete bill.");
    }
    setDeleteConfirm(null); // Close modal after deletion
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/bills/update-status/${id}`, { status: newStatus });
      setBills(
        bills.map((bill) =>
          bill._id === id ? { ...bill, status: newStatus } : bill
        )
      );
      toast.success("Bill status updated successfully.");
      setShowConfirm(null);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-fuchsia-50 p-6 font-mono">
        <h1 className="text-4xl font-bold text-fuchsia-800 mb-8 text-center"> 📊 Billing Dashboard</h1>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by Company Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-fuchsia-400 rounded px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
          />
        </div>
        {loading ? (
          <p className="text-center">Loading bills...</p>
        ) : (
          <div className="overflow-x-auto rounded">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-fuchsia-700 text-white">
                
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Thread Cone Details</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Phone no</th>
                  <th className="py-3 px-4">Paid status</th>
                  <th className="py-3 px-4">Actions</th>
                  <th className="py-3 px-4">Download</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  
                  <tr key={bill._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4 font-medium">{new Date(bill.date).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4 font-semibold text-lg">{bill.company_name}</td>
                    <td className="py-3 px-4">
                      <div className="p-2">
                        <table className="w-full border border-gray-300 text-left text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border px-2 py-1">Shade</th>
                              <th className="border px-2 py-1">Count</th>
                              <th className="border px-2 py-1">Price per Cone</th>
                              <th className="border px-2 py-1">Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bill.thread_items.map((item, index) => (
                              <tr key={index} className="border">
                                <td className="border px-2 py-1">{item.cone_colour}</td>
                                <td className="border px-2 py-1">{item.cone_count}</td>
                                <td className="border px-2 py-1">₹{item.price_per_cone.toFixed(2)}</td>
                                <td className="border px-2 py-1">₹{(item.cone_count * item.price_per_cone).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 font-medium">₹{bill.overall_total}</td>
                    <td className="py-3 px-4 font-medium">{bill.phone_no}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${bill.status === "pending" ? "bg-yellow-500" : "bg-green-500"}`}>
                        {bill.status}
                      </span>
                      {bill.status === "pending" && (
                        <button onClick={() => setShowConfirm(bill._id)} className="ml-2 mt-2 px-2 py-1 text-sm bg-blue-500 text-white rounded">
                          Mark as Paid
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Tooltip title="Edit Bill">
                          <button onClick={() => handleEdit(bill)} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete Bill">
                          <button onClick={() => setDeleteConfirm(bill._id)} className="text-red-600 hover:text-red-800">
                            <FaTrash />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Tooltip title="Download PDF">
                          <button onClick={() => handleDownload(bill)} className="text-green-600 hover:text-green-800">
                            <FaDownload />
                          </button>
                        </Tooltip>
                    
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 font-mono">
          <div className="bg-white p-6 rounded shadow-lg text-center w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Bill</h2>

            {/* Company Name */}
            <label className="block text-left font-bold">Company Name:</label>
            <input
              type="text"
              className="border p-2 w-full mb-3"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />

            {editBill && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 font-mono">
                <div className="bg-white p-6 rounded shadow-lg text-center w-96 max-h-[80vh] overflow-y-auto"> {/* Added max-height and overflow */}
                  <h2 className="text-xl font-semibold mb-4">Edit Bill</h2>

                  {/* Form Fields */}
                  <label className="block text-left font-bold">Company Name:</label>
                  <input type="text" className="border p-2 w-full mb-3" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />

                  {/* Thread Items */}
                  <button className="px-4 py-2 bg-green-500 text-white rounded mb-3" onClick={() => {
                    const newItems = [...formData.thread_items, { cone_colour: "", cone_count: 0, price_per_cone: 0 }];
                    setFormData({ ...formData, thread_items: newItems, overall_total: calculateTotal(newItems) });
                  }}>
                    + Add Thread Item
                  </button>

                  {formData.thread_items.map((item, index) => (
                    <div key={index} className="mb-3 border p-2 rounded relative">
                      <label className="block text-left">Shade:</label>
                      <input type="text" className="border p-1 w-full mb-1" value={item.cone_colour} onChange={(e) => {
                        const updatedItems = [...formData.thread_items];
                        updatedItems[index].cone_colour = e.target.value;
                        setFormData({ ...formData, thread_items: updatedItems });
                      }} />

                      <label className="block text-left">Count:</label>
                      <input type="number" className="border p-1 w-full mb-1" value={item.cone_count} onChange={(e) => {
                        const updatedItems = [...formData.thread_items];
                        updatedItems[index].cone_count = Number(e.target.value);
                        setFormData({ ...formData, thread_items: updatedItems, overall_total: calculateTotal(updatedItems) });
                      }} />

                      <label className="block text-left">Price per Cone:</label>
                      <input type="number" className="border p-1 w-full" value={item.price_per_cone} onChange={(e) => {
                        const updatedItems = [...formData.thread_items];
                        updatedItems[index].price_per_cone = Number(e.target.value);
                        setFormData({ ...formData, thread_items: updatedItems, overall_total: calculateTotal(updatedItems) });
                      }} />

                      {/* Remove Button */}
                      <button className="px-3 py-1 bg-red-500 text-white rounded mt-2" onClick={() => {
                        const updatedItems = formData.thread_items.filter((_, i) => i !== index);
                        setFormData({ ...formData, thread_items: updatedItems, overall_total: calculateTotal(updatedItems) });
                      }}>
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Updated Total Amount */}
                  <label className="block text-left font-bold">Total Amount:</label>
                  <input type="number" className="border p-2 w-full mb-3" value={formData.overall_total} readOnly />

                  {/* Status Dropdown */}
                  <label className="block text-left font-bold">Status:</label>
                  <select className="border p-2 w-full mb-3" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>

                  {/* Buttons */}
                  <div className="flex justify-between mt-4">
                    <button onClick={handleUpdateBill} className="px-4 py-2 bg-blue-500 text-white rounded">
                      Update
                    </button>
                    <button onClick={() => setEditBill(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Total Amount */}
            <label className="block text-left font-bold">Total Amount:</label>
            <input
              type="number"
              className="border p-2 w-full mb-3"
              value={formData.overall_total}
              onChange={(e) => setFormData({ ...formData, overall_total: Number(e.target.value) })}
            />

            {/* Status */}
            <label className="block text-left font-bold">Status:</label>
            <select
              className="border p-2 w-full mb-3"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>

            <div className="flex justify-between mt-4">
              <button onClick={handleUpdateBill} className="px-4 py-2 bg-blue-500 text-white rounded">
                Update
              </button>
              <button onClick={() => setEditBill(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 font-mono">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">Are you sure you want to delete this bill?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Yes
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 font-mono">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">Confirm marking as paid?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleUpdateStatus(showConfirm, "paid")} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Yes</button>
              <button onClick={() => setShowConfirm(null)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">No</button>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Dashboard;
