const Cone = require('../models/coneModel'); 

// GET all cones
const getAllCones = async (req, res) => {
  try {
    const cones = await Cone.find();
    res.status(200).json(cones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cones' });
  }
};

// POST create new cone
const createCone = async (req, res) => {
  try {
    const { color, availableQuantity } = req.body;
    const newCone = new Cone({ color, availableQuantity });
    await newCone.save();
    res.status(201).json(newCone);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create cone' });
  }
};

// PUT update a cone
const updateCone = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, availableQuantity } = req.body;
    const updatedCone = await Cone.findByIdAndUpdate(
      id,
      { color, availableQuantity },
      { new: true }
    );
    if (!updatedCone) {
      return res.status(404).json({ error: 'Cone not found' });
    }
    res.status(200).json(updatedCone);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update cone' });
  }
};

// DELETE a cone
const deleteCone = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCone = await Cone.findByIdAndDelete(id);
    if (!deletedCone) {
      return res.status(404).json({ error: 'Cone not found' });
    }
    res.status(200).json({ message: 'Cone deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete cone' });
  }
};

module.exports = {
  getAllCones,
  createCone,
  updateCone,
  deleteCone,
};
