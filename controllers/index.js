const express = require('express');
const router = express.Router();


router.use(require('./user'))

router.get('/', function(req, res) {
  res.render('index', { title: 'Destiny', message: 'Enter Gamertag' })
})

module.exports = router