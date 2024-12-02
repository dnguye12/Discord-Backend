const channelsRouter = require('express').Router()

const Channel = require('../models/channel')

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

module.exports = channelsRouter