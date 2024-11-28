const serversRouter = require('express').Router()

const Server = require('../models/server')
const Channel = require('../models/channel')
const Member = require('../models/member')

serversRouter.get('/one-by-profile', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Profile ID')
    }

    try {
        let server = await Server.findOne({ profile: id })
        if (server) {
            return res.status(200).json(server)
        } else {
            return res.status(200).json({ error: 'No server found' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error')
    }
})

serversRouter.get('/all-by-profile', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Profile ID')
    }

    try {
        let servers = await Server.find({ profileId: id })
        if (servers) {
            return res.status(200).json(servers)
        } else {
            return res.status(200).json({ error: 'No server found' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error')
    }
})

serversRouter.post('/', async (req, res) => {
    const { name, imageUrl, profileId } = req.body

    const newServer = new Server({
        name,
        imageUrl,
        profileId
    })
    try {
        const savedServer = await newServer.save()

        const newChannel = new Channel({
            name: 'general',
            type: 'TEXT',
            profileId,
            server: savedServer._id
        })

        const savedChannel = await newChannel.save();

        savedServer.channels = savedServer.channels.concat(savedChannel._id);
        await savedServer.save()

        const newMember = new Member({
            role: "ADMIN",
            profileId,
            server: savedServer._id
        })

        const savedMember = await newMember.save()

        savedServer.members = savedServer.members.concat(savedMember._id)
        await savedServer.save()

        return res.status(201).json(savedServer);
    } catch (error) {
        console.log(error)
        return res.status(404).json('Error saving new server to database')
    }
})

module.exports = serversRouter