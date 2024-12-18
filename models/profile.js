const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const onlineType = ['ONL', 'OFF']

const ProfileSchema = new mongoose.Schema({
    //Use a string to sync with Clerk 
    _id: {
        type: String
    },
    name: {
        type: String
    },
    //the profile picture
    imageUrl: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    online: {
        type: String,
        enum: onlineType,
        default: 'OFF'
    },
    lastActive: {
        type: Date
    },
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