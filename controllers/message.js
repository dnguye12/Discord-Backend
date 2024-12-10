const messagesRouter = require('express').Router()

const Channel = require('../models/channel')
const Message = require('../models/message')
const { getSocket } = require('../socket')

const MESSAGE_BATCH = 10

messagesRouter.get('/', async (req, res) => {
    const channelId = req.query.channelId;
    const cursor = req.query.cursor;

    if (!channelId) {
        return res.status(400).json("Missing channel")
    }

    const channel = await Channel.findById(channelId)

    let query = { channel: channel._id };

    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(MESSAGE_BATCH)
        .populate({ path: "member", populate: { path: "profile" } })
        .populate({ path: "channel" });

    const nextCursor = messages.length === MESSAGE_BATCH
        ? messages[messages.length - 1].createdAt.toISOString()
        : null;

    try {
        if (messages) {
            return res.status(200).json(
                {
                    messages,
                    nextCursor
                })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

messagesRouter.patch('/edit-content', async (req, res) => {
    const { id } = req.query
    const { newContent, channelId } = req.body

    if (!id) {
        return res.status(400).json("Can't find message")
    }

    try {
        const message = await Message.findById(id)

        if (!message) {
            return res.status(400).json("Can't find message")
        }

        message.content = newContent

        const updatedMessage = await message.save()

        const updateKey = `chat:${channelId}:messages:update`

        const io = getSocket()

        io.emit(updateKey, updatedMessage)

        return res.status(201).json(updatedMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

messagesRouter.put('/delete', async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(400).json("Can't find message")
    }

    try {
        const message = await Message.findById(id)

        if (!message) {
            return res.status(400).json("Can't find message")
        }

        message.content = "This message was deleted."
        message.fileUrl = ""
        message.deleted = true

        const updatedMessage = await message.save()

        return res.status(200).json(updatedMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

module.exports = messagesRouter