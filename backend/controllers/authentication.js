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
        req.session.userId = user.userId
        res.json({ user })
    }

    console.log(user)
})

// EXAMPLE ROUTE FOR CROSS-SITE REQUEST FORGERY
// checks session to see if user is logged in before doing the thing
router.post('/super-important-route', async (req, res) => {
    if(req.session.userId){
        console.log('Do the really important thing')
        res.send('Done')
    } else {
        console.log('You are not authorized to do the super important thing.')
        res.send('Denied')
    }
})

// route handler
// returns currently logged-in user
router.get('/profile', async (req, res) => {
    console.log(req.session.userId)
    try {
        let user = await User.findOne({
            where: {
                userId: req.session.userId
            }
        })
        res.json(user)
        // sends null if user isn't found
    } catch {
        res.json(null)
    }
})

// EXPORT
module.exports = router