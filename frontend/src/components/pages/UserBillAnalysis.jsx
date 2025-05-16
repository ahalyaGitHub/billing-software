import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const UserBillAnalysisPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [companyData, setCompanyData] = useState([]);
  const [graphData, setGraphData] = useState([]);

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

  useEffect(() => {
    if (bills.length > 0) {
      // Calculate paid vs unpaid count and total amount
      const paid = bills.filter(bill => bill.status === "paid").length;
      const unpaid = bills.filter(bill => bill.status === "pending").length;
      const total = bills.reduce((acc, bill) => acc + bill.overall_total, 0);

      setPaidCount(paid);
      setUnpaidCount(unpaid);
      setTotalAmount(total);

      // Group bills by company name
      const companyStats = bills.reduce((acc, bill) => {
        if (!acc[bill.company_name]) {
          acc[bill.company_name] = { total: 0, count: 0 };
        }
        acc[bill.company_name].total += bill.overall_total;
        acc[bill.company_name].count += 1;
        return acc;
      }, {});

      setCompanyData(Object.entries(companyStats).map(([company, data]) => ({
        company_name: company,
        total: data.total,
        count: data.count,
      })));


      // Graph data for paid vs unpaid bills
      setGraphData([
        { name: "Paid", value: paid },
        { name: "Unpaid", value: unpaid },
      ]);
    }
  }, [bills]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center font-mono px-6 py-10">
        <div className="w-full max-w-6xl bg-white rounded-lg p-8 space-y-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800">Your Bill Analysis</h2>

          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading bill analysis...</div>
          ) : (
            <>
              {/* Overview Section */}
              <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg">
                  <div className="flex flex-col items-center justify-center bg-indigo-100 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Total Bills</p>
                    <p className="text-xl text-indigo-600">{bills.length}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-green-100 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Paid Bills</p>
                    <p className="text-xl text-green-600">{paidCount}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-red-100 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Unpaid Bills</p>
                    <p className="text-xl text-red-600">{unpaidCount}</p>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="font-semibold text-2xl text-gray-800">Total Amount: ₹{totalAmount}</p>
                </div>
              </div>

              {/* Pie Chart for Paid vs Unpaid */}
              <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Bill Status Breakdown</h3>
                <div className="flex justify-center">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={graphData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                    >
                      {graphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#82ca9d" : "#ff8042"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>

        
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBillAnalysisPage;
