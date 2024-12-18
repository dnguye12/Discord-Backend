const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const DirectMessageSchema = new mongoose.Schema({
    //the content if this is a text message ( empty if this an image/file message)
    content: String,
    //if this is an image/file message, this is the url to said file (empty if text message)
    fileUrl: String,
    //profile of the person sending this
    profile: {
        type: String,
        ref: 'Profile'
    },
    //which conversation this message belongs to
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    deleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

DirectMessageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

DirectMessageSchema.plugin(uniqueValidator)

module.exports = mongoose.model('DirectMessage', DirectMessageSchema)