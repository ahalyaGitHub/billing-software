const express = require('express');
const router = express.Router();
const {
  getAllCones,
  createCone,
  updateCone,
  deleteCone,
} = require('../controllers/coneController');

router.get('/', getAllCones);
router.post('/', createCone);
router.put('/:id', updateCone);
router.delete('/:id', deleteCone);

module.exports = router;
