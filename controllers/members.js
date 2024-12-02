const membersRouter = require('express').Router()

const Member = require('../models/member')

membersRouter.get('/by-server-id', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Server ID')
    }

    try {
        const members = await Member.find({ server: id })

        return res.status(200).json(members)
    } catch (error) {
        console.error(error);
        return res.status(500).json('Backend error');
    }
})

module.exports = membersRouter