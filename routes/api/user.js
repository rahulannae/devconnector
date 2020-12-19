const express = require('express');
const router = express.Router();

// @route   api/user/test
// @access  public
router.get('/test', (req, res) => res.json({ success: 'User routes active!' }));

module.exports = router;