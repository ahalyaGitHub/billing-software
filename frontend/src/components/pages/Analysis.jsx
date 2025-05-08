import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import Navbar from '../Navbar';

const AnalysisPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetching the billing data dynamically from the backend
    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/bills/');
                console.log(response.data);  // Log the response to ensure the structure is correct
                setBills(response.data.bills);  // Ensure we are accessing 'bills' correctly
                setLoading(false);
            } catch (error) {
                console.error('Error fetching billing data', error);
                setLoading(false);
            }
        };
        fetchBillingData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!Array.isArray(bills)) {
        return <div>Error: Bills data is not an array.</div>;
    }

    // Process data for Line Chart (Total Amount per Date)
    const revenueData = bills.reduce((acc, bill) => {
        const date = new Date(bill.date).toLocaleDateString('en-GB');
        const amount = bill.overall_total && !isNaN(bill.overall_total) ? bill.overall_total : 0;

        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.amount += amount;
        } else {
            acc.push({ date, amount });
        }
        return acc;
    }, []);

    // Process data for Pie Chart (Paid vs Pending)
    const statusData = [
        { name: 'Paid', value: bills.filter(b => b.status === 'paid').length },
        { name: 'Pending', value: bills.filter(b => b.status === 'pending').length },
    ];

    const COLORS = ['#00C49F', '#FFBB28'];

    // Process data for Bar Chart (Company-wise Total Amount)
    const companyData = bills.reduce((acc, bill) => {
        const amount = bill.overall_total || 0;

        const existing = acc.find(item => item.company === bill.company_name);
        if (existing) {
            existing.amount += amount;
        } else {
            acc.push({ company: bill.company_name, amount });
        }
        return acc;
    }, []);

    return (
        <>
            <Navbar />
            <div className="p-8 bg-gray-50 min-h-screen font-mono">
                <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">📊 Billing Analysis Dashboard</h1>


                {/* Pie Chart */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-center">Payment Status Distribution</h2>
                    <div className="flex justify-center">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-center">Company-wise Billing Summary</h2>
                    <div className="flex justify-center">
                        <BarChart width={800} height={300} data={companyData.length > 0 ? companyData : [{ company: "No Data", amount: 0 }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="company" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                    </div>
                </div>
            </div>

            {/* Line Chart */}
            <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-center">Total Revenue Over Time</h2>
                    <div className="flex justify-center">
                        <LineChart width={800} height={300} data={revenueData.length > 0 ? revenueData : [{ date: "No Data", amount: 0 }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </div>
                </div>
        </>
    );
};

export default AnalysisPage;
