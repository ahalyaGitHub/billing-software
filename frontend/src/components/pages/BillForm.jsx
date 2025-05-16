import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillForm = () => {
  const [bill, setBill] = useState({
    userId: "",
    companyName: "",
    phone_no: "",
    items: [{ color: "", count: "", price_per_cone: "" }],
  });

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://billing-software-4dft.onrender.com/user");
        
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setBill({ ...bill, companyName: value });
      const filtered = customers.filter((cust) =>
        cust.company_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else if (name === "userId") {
      const selectedCustomer = customers.find((cust) => cust._id === value);
      if (selectedCustomer) {
        setBill({
          ...bill,
          userId: value,
          companyName: selectedCustomer.company_name,
          phone_no: selectedCustomer.phone,
        });
      }
    } else {
      const newItems = [...bill.items];
      newItems[index][name] = value;
      setBill({ ...bill, items: newItems });
    }
  };

  const addItem = () => {
    setBill({
      ...bill,
      items: [...bill.items, { color: "", count: "", price_per_cone: "" }],
    });
  };

  const removeLastItem = () => {
    if (bill.items.length > 1) {
      setBill({ ...bill, items: bill.items.slice(0, -1) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate overall_total
    const overall_total = bill.items.reduce(
      (total, item) =>
        total + item.count * item.price_per_cone,
      0
    );

    const formattedBill = {
      user_id: bill.userId,
      company_name: bill.companyName,
      phone_no: bill.phone_no,
      thread_items: bill.items.map((item) => ({
        cone_colour: item.color,
        cone_count: parseInt(item.count, 10),
        price_per_cone: parseFloat(item.price_per_cone),
      })),
      overall_total,
    };

    try {
      const response = await axios.post(
        "https://billing-software-4dft.onrender.com/bills/create",
        formattedBill
      );

      if (response.data.success) {
        toast.success("Bill Created Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setBill({
          userId: "",
          companyName: "",
          phone_no: "",
          items: [{ color: "", count: "", price_per_cone: "" }],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create bill. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-fuchsia-100 font-mono">
        <div className="max-w-lg w-full p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Generate Bill</h2>

          <form onSubmit={handleSubmit}>
            {/* Company Name Filter Input */}
            <label className="block mb-2">Search Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={bill.companyName}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Type to filter customers..."
            />

            {/* User Dropdown */}
            <label className="block mb-2">Select Customer (Company - Phone):</label>
            <select
              name="userId"
              value={bill.userId}
              onChange={(e) => handleChange(e)}
              required
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">-- Select Customer --</option>
              {filteredCustomers.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.company_name} - {cust.phone}
                </option>
              ))}
            </select>

            {/* Bill Items */}
            {bill.items.map((item, index) => (
              <div key={index} className="mb-4">
                <label className="block">Thread Colour:</label>
                <input
                  type="text"
                  name="color"
                  value={item.color}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="w-full p-2 border rounded"
                />

                <label className="block mt-2">Count:</label>
                <input
                  type="number"
                  name="count"
                  value={item.count}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="w-full p-2 border rounded"
                />

                <label className="block mt-2">Price per Cone:</label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_cone"
                  value={item.price_per_cone}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}

            {/* Add/Remove Item Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={addItem}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-1/2 mr-2"
              >
                Add More Items
              </button>

              {bill.items.length > 1 && (
                <button
                  type="button"
                  onClick={removeLastItem}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-1/2 ml-2"
                >
                  Remove Last Item
                </button>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Generate Bill
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default BillForm;
