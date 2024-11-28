const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const channelType = ['TEXT', 'AUDIO', 'VIDEO']

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        enum: channelType,
        default: 'TEXT'
    },
    profileId: {
        type: String,
        ref: 'Profile'
    },
    server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
})

ChannelSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ChannelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', ChannelSchema)