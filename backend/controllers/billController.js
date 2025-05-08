const Bill = require('../models/billModel');
const jwt = require("jsonwebtoken")

// Create a new bill
exports.createBill = async (req, res) => {
    try {
        const { user_id, company_name, phone_no, thread_items } = req.body;

        // Calculate total price for each thread item and overall total
        let overall_total = 0;
        thread_items.forEach(item => {
            item.total_price = item.cone_count * item.price_per_cone;
            overall_total += item.total_price;
        });

        // Create the bill entry
        const newBill = new Bill({
            user_id,
            company_name,
            phone_no,
            thread_items,
            overall_total,
            status: 'pending'
        });

        await newBill.save();

        res.status(201).json({ success: true, message: 'Bill created successfully', bill: newBill });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// Get all bills
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.find().sort({ date: -1 });
        res.status(200).json({ success: true, bills });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Get a single bill by ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Update a bill (e.g., mark it as paid)
exports.updateBillStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bill = await Bill.findById(req.params.id);

        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

        bill.status = status || bill.status;
        await bill.save();

        res.status(200).json({ success: true, message: 'Bill status updated successfully', bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

        await bill.deleteOne();
        res.status(200).json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Update bill details
exports.updateBill = async (req, res) => {
    const { id } = req.params;
    const { company_name, thread_items, overall_total, status } = req.body;

    console.log("Received update request for bill:", id);
    console.log("Request Body:", req.body);

    try {
        const updatedBill = await Bill.findByIdAndUpdate(
            id,
            { company_name, thread_items, overall_total, status },
            { new: true, runValidators: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ success: false, message: "Bill not found" });
        }

        res.json({ success: true, message: "Bill updated successfully", bill: updatedBill });
    } catch (error) {
        console.error("Error updating bill:", error);
        res.status(500).json({ success: false, message: "Error updating bill", error });
    }
};

exports.search = async (req, res) => {
    const searchTerm = req.query.search || "";

    try {
        const bills = await Bill.find({
            company_name: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
        });
        res.json({ bills });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch bills" });
    }
};

// ✅ GET all bills of the logged-in user
exports.getUserBills = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔓 decode JWT
      const userId = decoded.id;
  
      const bills = await Bill.find({ user_id: userId });
      res.json({ success: true, bills });
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      res.status(401).json({ message: "Invalid token", error: err.message });
    }
  };