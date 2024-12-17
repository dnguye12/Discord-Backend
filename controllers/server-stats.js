const mongoose = require('mongoose')
const serverStatsRouter = require('express').Router()

const Message = require('../models/message');
const Member = require('../models/member');
const Profile = require('../models/profile');

serverStatsRouter.get('/top-users', async (req, res) => {
    const { id } = req.query
    const serverId = id
    try {
        const topUsers = await Message.aggregate([
            {
                $lookup: {
                    from: 'members',
                    localField: 'member',
                    foreignField: '_id',
                    as: 'memberDetails'
                }
            },
            { $unwind: '$memberDetails' },
            { $match: { 'memberDetails.server': new mongoose.Types.ObjectId(serverId) } },
            {
                $group: {
                    _id: '$memberDetails.profile',
                    messageCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            { $unwind: '$profile' },
            {
                $project: {
                    _id: 1,
                    name: '$profile.name',
                    messageCount: 1
                }
            },
            { $sort: { messageCount: -1 } }
        ])

        return res.status(200).json(topUsers)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

serverStatsRouter.get('/role-counts', async (req, res) => {
    const { id } = req.query
    const serverId = id

    try {
        const roleCounts = await Member.aggregate([
            { $match: { server: new mongoose.Types.ObjectId(serverId) } },
            { $group: { _id: '$role', count: { $sum: 1 } } },
            { $project: { _id: 0, role: '$_id', count: 1 } }
        ]);

        return res.status(200).json(roleCounts)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

serverStatsRouter.get('/member-growth', async(req, res) => {
    const { id } = req.query
    const serverId = id

    try {
        const growthData = await Member.aggregate([
            { $match: { server: new mongoose.Types.ObjectId(serverId) } }, 
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } 
        ]);

        let cumulativeCount = 0;
        const cumulativeGrowth = growthData.map(data => {
            cumulativeCount += data.count;
            return { date: data._id, totalMembers: cumulativeCount };
        });

        return res.status(200).json(cumulativeGrowth)
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

module.exports = serverStatsRouter