const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const conversation = require('./conversation')

const DirectMessageSchema = new mongoose.Schema({
    content: String,
    fileUrl: String,
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
})

DirectMessageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

DirectMessageSchema.plugin(uniqueValidator)

module.exports = mongoose.Model('DirectMessage', DirectMessageSchema)