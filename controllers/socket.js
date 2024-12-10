const socketRouter = require('express').Router()

const Channel = require('../models/channel')
const Member = require('../models/member')
const Message = require('../models/message')
const DirectMessage = require('../models/direct-message')
const Conversation = require('../models/conversation')
const Profile = require('../models/profile')
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

        io.to(channelKey).emit(`chat:${channelId}:messages`, savedMessage)

        return res.status(200).json(savedMessage)

    }catch(error) {
        console.log(error)
        return res.status(500).json("Internal Error")
    }
})

socketRouter.post('/direct-message', async(req, res) => {
    const {userId, conversationId, content, fileUrl} = req.body
    try {
        const conversation = await Conversation.findById(conversationId)

        if(!conversation) {
            return res.status(401).json('Cant find conversation')
        }

        const profile = await Profile.findById(userId)

        if(!profile) {
            return res.status(401).json('Cant find user in this server')
        }

        const newDirectMessage = new DirectMessage({
            content,
            fileUrl,
            profile: profile.id,
            conversation: conversation.id,
        })
        const savedMessage = await newDirectMessage.save()

        const channelKey = `chat:${conversationId}:messages`

        const io = getSocket()

        io.to(channelKey).emit(`chat:${conversationId}:messages`, savedMessage)

        return res.status(200).json(savedMessage)

    }catch(error) {
        console.log(error)
        return res.status(500).json("Internal Error")
    }
})

module.exports = socketRouter