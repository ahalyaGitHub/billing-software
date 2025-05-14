import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <>
            <div className="h-screen flex flex-col items-center justify-center bg-fuchsia-100 font-mono px-4 text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    Ahalya Traders — Admin Panel
                </h1>
                <h2 className="text-2xl text-gray-700 mb-6">
                    Streamline your business with our digital billing and inventory management system.
                </h2>
                <p className="text-lg text-gray-600 mb-10 max-w-xl">
                    Effortlessly handle customer orders, generate bills, and monitor sales insights — all from a
                    single, powerful dashboard built for thread cone businesses like yours.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/generate-bill">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            📑 Generate New Bill
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            📊 View Dashboard
                        </button>
                    </Link>
                    <Link to="/analysis">
                        <button className="px-6 py-3 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-800 transition">
                            📈 Dashboard Overview
                        </button>
                    </Link>
                    <Link to="/manage-users">
                        <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                            👥 Manage Cutomers
                        </button>
                    </Link>
                    <Link to="/manage-cones">
                        <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-yellow-700 transition">
                            🧵 Manage Cone
                        </button>
                    </Link>
                </div>
           </div>

        </>
    )
}

export default AdminDashboard