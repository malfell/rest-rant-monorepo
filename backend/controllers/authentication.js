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

    // compare user's typed password with the password in the backend
    if(!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({
            message: `Could not find a user with the provided username and password`
        })
    // if password matches what was originally hashed, then controller skips to 
    // else block and responds to log in request
    } else {
        res.json({ user })
    }

    console.log(user)
})

// route handler that handles fetch requests
// checks for logged-in user every time the React app loads
router.get('/profile', async (req, res) => {
    try {
        // let user = await User.findOne({
        //     where: {
        //         userId: 
        //     }
        // })
        // res.json(user)
        // if no logged-in user, then backend responds with null
    } catch {
        res.json(null)
    }
})

// EXPORT
module.exports = router