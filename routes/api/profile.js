const express = require('express');
const router = express.Router();

// @route   api/profile/test
// @access  public
router.get('/test', (req, res) => res.json({ success: 'Profile routes active!' }));

module.exports = router;