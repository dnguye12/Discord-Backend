const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//messages inside a text channel of a server
const MessageSchema = new mongoose.Schema({
    //the content if this is a text message ( empty if this an image/file message)
    content: String,
    //if this is an image/file message, this is the url to said file (empty if text message)
    fileUrl: String,
    //which member id is sending this message
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    //which channel this message belongs to
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    //show if a message is deleted
    // the message would be changed to "This message is deleted"
    //this is the standard for discord, apple,..
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
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