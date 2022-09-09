const router = require('express').Router()
const db = require("../models")
// require bcrypt
const bcrypt = require('bcrypt')

const { User } = db

// runs when sign-up form is submitted and where we'll want to hash the user's password
// need to run "npm install bcrypt" in back-end directly terminal first
router.post('/', async (req, res) => {
    // variable for password
    let { password, ...rest } = req.body;
    // hashes password
    const user = await User.create({
        ...rest,
        passwordDigest: await bcrypt.hash(password, 10)
    })
    res.json(user)
})


router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

module.exports = router