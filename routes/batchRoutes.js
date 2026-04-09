const express = require('express');
const router = express.Router();
const batchController = require('../controllers/BatchController')
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validationMiddleware')

// Validation Rules
const createBatchValidation = [
  body('batchName').notEmpty().withMessage('Batch name is required').trim(),
  body('course').notEmpty().withMessage('Course is required').trim(),
  body('courseType').isIn(['Medical', 'Engineering', 'School', 'Competitive', 'Other']),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601(),
  validateRequest
];

// ====================== BATCH ROUTES ======================
router.post('/', 
  protect, 
  authorize('admin'), 
  ...createBatchValidation, 
  batchController.createBatch
);

router.get('/', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.getAllBatches
);

router.get('/:id', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.getBatchById
);

router.put('/:id', 
  protect, 
  authorize('admin'), 
  batchController.updateBatch
);

router.delete('/:id', 
  protect, 
  authorize('admin'), 
  batchController.deleteBatch
);

// ====================== STUDENT MANAGEMENT ======================
router.post('/add-student', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.addStudentToBatch
);

router.post('/bulk-add-students', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.bulkAddStudentsToBatch
);

router.post('/remove-student', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.removeStudentFromBatch
);

router.get('/:id/students', 
  protect, 
  authorize('admin', 'teacher'), 
  batchController.getBatchStudents
);

module.exports = router;