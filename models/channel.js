const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//mongoose model for Server channels.

//There are only 3 main type of channels atm.
const channelType = ['TEXT', 'AUDIO', 'VIDEO']

const ChannelSchema = new mongoose.Schema({
    //The channel name
    name: {
        type: String
    },
    //Text, audio or video channel
    type: {
        type: String,
        enum: channelType,
        default: 'TEXT'
    },
    //Profile id of the creator
    profile: {
        type: String,
        ref: 'Profile'
    },
    //Server id of which this channel belongs to
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

//When the database returns the object, convert the field "_id" to "id"
ChannelSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ChannelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Channel', ChannelSchema)