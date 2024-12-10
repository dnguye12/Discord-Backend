const directMessagesRouter = require('express').Router()

const DirectMessage = require('../models/direct-message')
const Conversation = require('../models/conversation')
const MESSAGE_BATCH = 10

directMessagesRouter.get('/', async (req, res) => {
    const conversationId = req.query.conversationId;
    const cursor = req.query.cursor;

    if (!conversationId) {
        return res.status(400).json("Missing conversation")
    }

    const conversation = await Conversation.findById(conversationId)

    let query = { conversation: conversation._id };

    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    let directMessages = await DirectMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(MESSAGE_BATCH)
        .populate({ path: "profile" })
        .populate({ path: "conversation" });

    const nextCursor = directMessages.length === MESSAGE_BATCH
        ? directMessages[directMessages.length - 1].createdAt.toISOString()
        : null;

    try {
        if (directMessages) {
            return res.status(200).json(
                {
                    directMessages,
                    nextCursor
                })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

directMessagesRouter.patch('/edit-content', async (req, res) => {
    const { id } = req.query
    const { newContent, conversationId } = req.body

    if (!id) {
        return res.status(400).json("Can't find message")
    }

    try {
        const directMessage = await DirectMessage.findById(id)

        if (!directMessage) {
            return res.status(400).json("Can't find directMessage")
        }

        directMessage.content = newContent

        const updatedDirectMessage = await directMessage.save()

        return res.status(201).json(updatedDirectMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

directMessagesRouter.put('/delete', async (req, res) => {
    const { id } = req.query

    if (!id) {
        return res.status(400).json("Can't find direct message")
    }

    try {
        const directMessage = await DirectMessage.findById(id)

        if (!directMessage) {
            return res.status(400).json("Can't find message")
        }

        directMessage.content = "This message was deleted."
        directMessage.fileUrl = ""
        directMessage.deleted = true

        const updatedMessage = await directMessage.save()

        return res.status(200).json(updatedMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal error")
    }
})

module.exports = directMessagesRouter