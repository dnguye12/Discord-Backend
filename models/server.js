const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ServerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    //the image to represent the server
    imageUrl: {
        type: String
    },
    //invite code to the server, avoid people knowing the server id to just join
    inviteCode: {
        type: String
    },
    //profile id of the person creating this server
    profile: {
        type: String,
        ref: 'Profile'
    },
    //list of members
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member'
        }
    ],
    //list of channels
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