const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const runCron = require('../../cron');

// @route GET api/cron
// Run Cron
// public access
router.route('/').get((req, res) => {
  runCron().then( response => {
    console.log(response)
    res.json(response);
  });
});

module.exports = router;
