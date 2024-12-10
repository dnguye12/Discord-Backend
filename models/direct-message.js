const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const DirectMessageSchema = new mongoose.Schema({
    content: String,
    fileUrl: String,
    profile: {
        type: String,
        ref: 'Profile'
    },
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