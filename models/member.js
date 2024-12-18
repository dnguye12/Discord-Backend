const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//There are only 3 roles for now
const roles = ['ADMIN', 'GUEST', 'MODERATOR']

const MemberSchema = new mongoose.Schema({
    //Which role is this member in this server
    role: {
        type: String,
        enum: roles,
        required: true
    },
    //profile id of the user. An user can be member of multiple servers
    profile: {
        type: String,
        ref: 'Profile'
    },
    //which server this member is from
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