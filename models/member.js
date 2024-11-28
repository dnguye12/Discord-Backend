const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roles = ['ADMIN', 'GUEST', 'MODERATOR']

const MemberSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: roles,
        required: true
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

MemberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

MemberSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Member', MemberSchema)