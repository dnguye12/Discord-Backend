const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//A conversation between 2 people
const ConversationSchema = new mongoose.Schema({
    //Profile id of the first person
    profileOne: {
        type: String,
        ref: 'Profile'
    },
    //Profile id of the second person
    profileTwo: {
        type: String,
        ref: 'Profile'
    },
    //List of messages between the 2 people
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

//When a conversation is removed, also remove all the direct messages.
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