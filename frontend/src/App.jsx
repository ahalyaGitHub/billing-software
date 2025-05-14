import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import BillForm from "./components/pages/BillForm";
import Dashboard from "./components/pages/Dashboard";
import AnalysisPage from "./components/pages/Analysis";
import ManageUsers from "./components/pages/ManageUsers";
import CustomerEntry from "./components/pages/customerEntry";
import UserBillPage from "./components/pages/UserBill";
import ConeAdminPage from "./components/pages/ConeAdminPage";
import UserConePage from "./components/pages/UserConePage";
import UserBillAnalysisPage from "./components/pages/UserBillAnalysis";
import ConeManager from "./components/pages/ConeAdminPage";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/customer-entry" element={<CustomerEntry />} />

        <Route path="/manage-users" element={<ManageUsers />} />

        <Route path="/manage-cones" element={<ConeManager />} />

        <Route path="/generate-bill" element={<BillForm />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/user-bill" element={<UserBillPage />} />

        <Route path="/admin-cone" element={<ConeAdminPage />} />
        <Route path="/user-cone" element={<UserConePage />} />
        <Route path="/user-analysis" element={<UserBillAnalysisPage />} />
       


        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
