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
    profile: {
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

ServerSchema.pre('remove', async function (next) {
    try {
        const Channel = mongoose.model('Channel');
        const Member = mongoose.model('Member');

        await Channel.deleteMany({ _id: { $in: this.channels } });

        await Member.deleteMany({ _id: { $in: this.members } });

        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model('Server', ServerSchema)