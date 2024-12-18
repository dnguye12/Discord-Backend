const channelsRouter = require('express').Router()

const Channel = require('../models/channel')
const Server = require('../models/server')

//Get a channel by id
channelsRouter.get('/', async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Channel ID')
    }

    try {
        const channel = await Channel.findById(id)

        if (!channel) {
            return res.status(404).json({ error: 'No channel found' });
        }

        return res.status(200).json(channel)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error')
    }
})

//delete a channel using its id 
//need to supply userId of the person calling this, the channel is only deleted if the userId is a member is either ADMIN or MODERATOR 
channelsRouter.put('/', async (req, res) => {
    const { id } = req.query
    const { userId } = req.body

    if (!id) {
        return res.status(400).json('Missing input Channel ID')
    }

    try {
        const channel = await Channel.findById(id)

        if (!channel) {
            return res.status(404).json({ error: 'No channel found' });
        }

        const server = await Server.findById(channel.server).populate({ path: 'members' })

        const helperMember = server.members.find((member) => member.profile === userId)

        if (!helperMember || (helperMember.role !== 'ADMIN' && helperMember.role !== "MODERATOR")) {
            return res.status(404).json("Unauthorized")
        }

        server.channels = server.channels.filter((channel) => channel.toString() !== id)

        await server.save()

        await channel.deleteOne()

        return res.status(200).json(server)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error')
    }
})

//return all channels from a server
channelsRouter.get('/by-server-id', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Server ID')
    }

    try {
        const channels = await Channel.find({ server: id })

        return res.status(200).json(channels)
    } catch (error) {
        console.error(error);
        return res.status(500).json('Backend error');
    }
})

//update the name of a channel
channelsRouter.put('/edit-name', async (req, res) => {
    let { id } = req.query
    let { newName, userId } = req.body

    if (!id) {
        return res.status(400).json('Missing input Channel ID')
    }

    try {
        const channel = await Channel.findById(id)

        if (!channel) {
            return res.status(404).json({ error: 'No channel found' });
        }

        const server = await Server.findById(channel.server).populate({ path: 'members' })

        const helperMember = server.members.find((member) => member.profile === userId)

        if (!helperMember || (helperMember.role !== 'ADMIN' && helperMember.role !== "MODERATOR")) {
            return res.status(404).json("Unauthorized")
        }

        channel.name = newName

        const savedChannel = await channel.save()

        return res.status(200).json(savedChannel)
    } catch (error) {
        console.log(error)
    }
})

module.exports = channelsRouter