const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const MessageSchema = new mongoose.Schema({
    content: String,
    fileUrl: String,
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
})

MessageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

MessageSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Message', MessageSchema)