// DEPENDENCIES
const router = require('express').Router();
const db = require('../models');
const bcrypt = require('bcrypt');

// require user model
// will need to query user from the database
const { User } = db

router.post('/', async (req, res) => {
    // initial check to see if login goes through
    // console.log('IN HERE')

    // checks credentials that the user provides and compares it to data in database
    // uses user model to find the user with whatever email the person entered
    let user = await User.findOne({
        where: { email: req.body.email }
    })

    console.log(user)
})

// EXPORT
module.exports = router