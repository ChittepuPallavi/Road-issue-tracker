const express = require('express');
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssueStatus,
  upvoteIssue
} = require('../controllers/issueController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(getIssues)
  .post(protect, upload.single('image'), createIssue);

router
  .route('/:id')
  .get(getIssue);

router
  .route('/:id/status')
  .put(protect, authorize('admin', 'worker'), updateIssueStatus);

router
  .route('/:id/upvote')
  .put(protect, upvoteIssue);

module.exports = router;