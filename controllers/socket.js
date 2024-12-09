const socketRouter = require('express').Router()

const Channel = require('../models/channel')
const Member = require('../models/member')
const Message = require('../models/message')
const { getSocket } = require('../socket')

socketRouter.post('/message', async(req, res) => {
    const {userId, channelId, content, fileUrl} = req.body
    try {
        const channel = await Channel.findById(channelId)

        if(!channel) {
            return res.status(401).json('Cant find channel')
        }

        const member = await Member.findOne({
            profile: userId,
            server: channel.server
        })

        if(!member) {
            return res.status(401).json('Cant find user in this server')
        }

        const newMessage = new Message({
            content,
            fileUrl,
            member: member.id,
            channel: channelId,
        })
        const savedMessage = await newMessage.save()

        const channelKey = `chat:${channelId}:messages`

        const io = getSocket()

        io.to(channelKey).emit('message', savedMessage)

        return res.status(200).json(savedMessage)

    }catch(error) {
        console.log(error)
        return res.status(500).json("Internal Error")
    }
})

module.exports = socketRouter