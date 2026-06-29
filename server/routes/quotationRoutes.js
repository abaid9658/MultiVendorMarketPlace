const express = require('express');
const router = express.Router();
const {
  getQuotations, getQuotation, createQuotation,
  updateQuotation, deleteQuotation, compareQuotations
} = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.get('/compare', protect, compareQuotations);
router.route('/').get(protect, getQuotations).post(protect, createQuotation);
router.route('/:id').get(protect, getQuotation).put(protect, updateQuotation).delete(protect, deleteQuotation);

module.exports = router;
