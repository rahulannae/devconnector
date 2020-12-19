const express = require('express');
const router = express.Router();

// @route   api/post/test
// @access  public
router.get('/test', (req, res) => res.json({ success: 'Post routes active!' }));

module.exports = router;