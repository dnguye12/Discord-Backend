const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ServerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    inviteCode: {
        type: String
    },
    profileId: {
        type: String,
        ref: 'Profile'
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member'
        }
    ],
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
})

ServerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ServerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Server', ServerSchema)