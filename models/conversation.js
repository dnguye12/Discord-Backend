const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ConversationSchema = new mongoose.Schema({
    profileOne: {
        type: String,
        ref: 'Profile'
    },
    profileTwo: {
        type: String,
        ref: 'Profile'
    },
    directMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DirectMessage'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
})

ConversationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ConversationSchema.plugin(uniqueValidator)

ConversationSchema.pre('remove', async function (next) {
    try {
        const DirectMessage = mongoose.model('DirectMessage')

        await DirectMessage.deleteMany({ _in: { $in: this.directMessages } })
        next()
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model('Conversation', ConversationSchema)