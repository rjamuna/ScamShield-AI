const express = require('express');
const router = express.Router();
const { analyze, analyzeUrl, getScans, getScan, deleteScan } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/analyze', analyze);
router.post('/url', analyzeUrl);
router.get('/', getScans);
router.get('/:id', getScan);
router.delete('/:id', deleteScan);

module.exports = router;
