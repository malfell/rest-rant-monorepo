// DEPENDENCIES
const router = require('express').Router();
const db = require('../models');
const bcrypt = require('bcrypt');

// require user model
// will need to query user from the database
const { User } = db

router.post('/', async (req, res) => {
    console.log('IN HERE')
})

// EXPORT
module.exports = router