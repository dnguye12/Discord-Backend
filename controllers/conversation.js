const conversationsRouter = require('express').Router()

const Conversation = require('../models/conversation')
const Profile = require('../models/profile')

conversationsRouter.post('/', async (req, res) => {
    const { profileOne, profileTwo } = req.query

    if (!profileOne || !profileTwo) {
        return res.status(400).json('Missing input')
    }

    try {
        const newConversation = new Conversation({
            profileOne,
            profileTwo,
        })

        const savedConversation = await newConversation.save()

        return res.status(200).json(savedConversation)
    } catch (error) {
        console.error(error);
        return res.status(500).json('Database error');
    }
})

conversationsRouter.get('/', async (req, res) => {
    const { id } = req.query
    if (!id) {
        return res.status(400).json('Missing input')
    }

    try {
        const conversation = await Conversation.findById(id).populate({ path: 'profileOne' }).populate({ path: 'profileTwo' })

        if (!conversation) {
            return res.status(400).json('Not found')
        }
        return res.status(200).json(conversation)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Database error")
    }
})

conversationsRouter.get('/find-with-profile', async (req, res) => {
    const { profile } = req.query

    if (!profile) {
        return res.status(400).json('Missing input')
    }

    try {
        const helperProfile = await Profile.findById(profile)

        if (!helperProfile) {
            return res.status(400).json("Cant find profile")
        }

        const conversations = await Conversation.find({
            $or: [
                { profileOne: helperProfile.id },
                { profileTwo: helperProfile.id }
            ]
        }).populate({ path: 'profileOne' }).populate({ path: 'profileTwo' })

        if (!conversations || conversations.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Database error');
    }
})

module.exports = conversationsRouter