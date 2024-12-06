const membersRouter = require('express').Router()

const Member = require('../models/member')

membersRouter.get('/by-server-id', async (req, res) => {
    let { id } = req.query

    if (!id) {
        return res.status(400).json('Missing input Server ID')
    }

    try {
        const members = await Member.find({ server: id }).populate({path: 'profile'})

        return res.status(200).json(members)
    } catch (error) {
        console.error(error);
        return res.status(500).json('Backend error');
    }
})

membersRouter.put('/update-role', async (req, res) => {
    let { id } = req.query
    const { newRole } = req.body

    if (!id) {
        return res.status(400).json('Missing input ID')
    }

    try {
        const member = await Member.findById(id)

        member.role = newRole

        const savedMember = await member.save()

        return res.status(201).json(savedMember)
    } catch (error) {
        console.log(error)
        return res.status(500).json('Backend error');
    }
})

module.exports = membersRouter