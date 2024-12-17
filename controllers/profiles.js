const profilesRouter = require('express').Router()

const Profile = require('../models/profile')

profilesRouter.get('/', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input ID')
    }

    try {
        let profile = await Profile.findById(id)
        if (profile) {
            return res.status(200).json(profile)
        } else {
            return res.status(204).json({ error: 'Profile not found' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error')
    }
})

profilesRouter.post('/', async (req, res) => {
    const { id, name, imageUrl, email, } = req.body

    const newProfile = new Profile({
        _id: id,
        name,
        imageUrl,
        email
    })

    try {
        const savedProfile = await newProfile.save()
        return res.status(201).json(savedProfile)
    } catch (error) {
        console.log(error)
        return res.status(404).json('Error saving new profile to database')
    }
})

profilesRouter.patch('/status', async (req, res) => {
    const { id } = req.query
    const { status, lastActive } = req.body

    if (!id) {
        return res.status(400).json('Missing input ID')
    }
    try {
        const profile = await Profile.findById(id)
        if (lastActive && new Date(lastActive) > profile.lastActive) {
            profile.lastActive = lastActive;
        }else {
            return res.status(200).json(profile)
        }
        profile.online = status

        const savedProfile = await profile.save()

        return res.status(200).json(savedProfile)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json('Internal error')
    }
})

module.exports = profilesRouter