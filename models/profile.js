const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ProfileSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    servers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Server'
        }
    ],
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

ProfileSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ProfileSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Profile', ProfileSchema)