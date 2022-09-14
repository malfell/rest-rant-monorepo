// DEPENDENCIES
const router = require('express').Router();
const db = require('../models');
const bcrypt = require('bcrypt');
// run: npm install json-web-token
const jwt = require('json-web-token')

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
        // if user has been found and password matches, use jwt module to create a JWT
        // first arg is random string for jwt to use to hash the token signature
            // like SESSION_SECRET, it'll be added to .env file
        // second arg is object to encode as the payload
            // this is data to check later to find logged-in user
        const result = await jwt.encode(process.env.JWT_SECRET, { id:user.userId })
        // when responding to front end, send back authenticated user and the JWT created
        res.json({ user: user, token: result.value })
    }

    console.log(user)
})

// route handler that handles fetch requests
// checks for logged-in user every time the React app loads
router.get('/profile', async (req, res) => {
    res.json(req.currentUser)
    
    // NOT NEEDED BUT KEEPING FOR FUTURE REFERENCE
    // try {
    //     // Split the authorization header into ['Bearer', 'TOKEN']
    //     const [authenticationMethod, token] = req.headers.authorization.split(' ')

    //     // Only handle 'Bearer' authorization for now
    //     // (we could add other authorization strategies later):
    //     if (authenticationMethod == 'Bearer'){

    //         // Decode the JWT
    //         const result = await jwt.decode(process.env.JWT_SECRET, token)

    //         // Get logged in user's id from the payload
    //         const { id } = result.value

    //         // Find the user object using their id
    //         let user = await User.findOne({
    //             where: {
    //                 userId: id
    //             }
    //         })
    //         res.json(user)
    //     }

    //     // if no logged-in user, then backend responds with null
    // } catch {
    //     res.json(null)
    // }
})

// EXPORT
module.exports = router