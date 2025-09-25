const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.render('ui-users');
})

router.get('/login', (req, res) => {
    res.render('ui-login');
})


module.exports = router;