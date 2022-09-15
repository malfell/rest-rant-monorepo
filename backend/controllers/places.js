const router = require('express').Router()
const db = require("../models")
import { CurrentUser } from './contexts/CurrentUser';

const { Place, Comment, User } = db
const { currentUser } = useContext(CurrentUser)

// CREATE A PLACE
router.post('/', async (req, res) => {
    // admin permissions
    // if user isn't admin, they cannot add a place
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to add a place' })
    }

    if (!req.body.pic) {
        req.body.pic = 'http://placekitten.com/400/400'
    }
    if (!req.body.city) {
        req.body.city = 'Anytown'
    }
    if (!req.body.state) {
        req.body.state = 'USA'
    }
    const place = await Place.create(req.body)
    res.json(place)
})

// GET ALL PLACES
router.get('/', async (req, res) => {
    const places = await Place.findAll()
    res.json(places)
})

// GET SPECIFIC PLACE
router.get('/:placeId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: { placeId: placeId },
            include: {
                association: 'comments',
                include: 'author'
            }
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            res.json(place)
        }
    }
})

// EDIT A PLACE
router.put('/:placeId', async (req, res) => {
    // admin permissions
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to edit places' })
    }

    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: { placeId: placeId },
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            Object.assign(place, req.body)
            await place.save()
            res.json(place)
        }
    }
})

// DELETE A PLACE
router.delete('/:placeId', async (req, res) => {
    // admin permissions
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to delete places' })
    }

    let placeId = Number(req.params.placeId)
    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else {
        const place = await Place.findOne({
            where: {
                placeId: placeId
            }
        })
        if (!place) {
            res.status(404).json({ message: `Could not find place with id "${placeId}"` })
        } else {
            await place.destroy()
            res.json(place)
        }
    }
})

// ADD A COMMENT
router.post('/:placeId/comments', async (req, res) => {
    const placeId = Number(req.params.placeId)

    req.body.rant = req.body.rant ? true : false

    const place = await Place.findOne({
        where: { placeId: placeId }
    })

    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` })
    }

    // responds with error if user is not logged in
    if (!req.currentUser) {
        return res.status(404).json({
            message: `You must be logged in to leave a rant or rave.`
        })
    }

    const comment = await Comment.create({
        ...req.body,
        // attach ID of logged-in user as authorId of the comment
        authorId: req.currentUser.userId,
        placeId: placeId
    })

    res.send({
        ...comment.toJSON(),
        author: req.currentUser
    })
})

// DELETE A COMMENT
router.delete('/:placeId/comments/:commentId', async (req, res) => {
    let placeId = Number(req.params.placeId)
    let commentId = Number(req.params.commentId)

    if (isNaN(placeId)) {
        res.status(404).json({ message: `Invalid id "${placeId}"` })
    } else if (isNaN(commentId)) {
        res.status(404).json({ message: `Invalid id "${commentId}"` })
    } else {
        const comment = await Comment.findOne({
            where: { commentId: commentId, placeId: placeId }
        })
        if (!comment) {
            res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` })
        // makes sure that a comment can ONLY be deleted if it was authored by the logged-in user
        // using a '?' in req.currentUser to that the IF statement will run whether a user
        // is currently logged in or not
        } else if (comment.authorId !== req.currentUser?.userId) {
            res.status(403).json({
                message: `You do not have permission to delete comment "${comment.commentId}"`
            })
        } else {
            await comment.destroy()
            res.json(comment)
        }
    }
})


module.exports = router