const config = require('./utils/config')
const logger = require("./utils/logger");
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const Channel = require('./models/channel');
const Server = require('./models/server');
const Profile = require('./models/profile');
const Member = require('./models/member');
const Message = require('./models/message');

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message);
    });

// Utility functions to create fake data
const generateProfiles = async (count) => {
    const profiles = [];
    for (let i = 0; i < count; i++) {
        const profile = new Profile({
            _id: faker.string.uuid(),
            name: faker.internet.username(),
            imageUrl: faker.image.avatar(),
            email: faker.internet.email(),
            lastActive: faker.date.recent(),
            createdAt: faker.date.past()
        });
        profiles.push(profile.save());
    }
    return Promise.all(profiles);
};

const generateServers = async (profiles, count) => {
    const servers = [];
    for (let i = 0; i < count; i++) {
        const server = new Server({
            name: faker.company.name(),
            imageUrl: faker.image.avatar,
            inviteCode: uuidv4(),
            profile: faker.helpers.arrayElement(profiles)._id,
            createdAt: faker.date.past()
        });
        servers.push(server.save());
    }
    return Promise.all(servers);
};

const generateChannels = async (servers, countPerServer) => {
    const channels = [];
    for (const server of servers) {
        for (let i = 0; i < countPerServer; i++) {
            const channel = new Channel({
                name: faker.word.noun(),
                type: faker.helpers.arrayElement(['TEXT']),
                server: server._id,
                createdAt: faker.date.past()
            });
            const savedChannel = await channel.save();
            await Server.findByIdAndUpdate(server._id, {
                $push: { channels: savedChannel._id }
            });
            channels.push(channel.save());
        }
    }
    return channels;
};

const generateMembers = async (servers, profiles) => {
    const members = [];
    for (const server of servers) {
        const numMembers = profiles.length;
        const shuffledProfiles = faker.helpers.shuffle(profiles);
        const adminMember = new Member({
            role: 'ADMIN',
            profile: server.profile, 
            server: server._id
        });
        const savedAdmin = await adminMember.save();
        await Server.findByIdAndUpdate(server._id, { $push: { members: savedAdmin._id } });
        members.push(savedAdmin);
        for (let i = 1; i < numMembers; i++) {
            const randomProfile = shuffledProfiles[i % shuffledProfiles.length];
            if (randomProfile._id === server.profile) {continue;}
            const member = new Member({
                role: faker.helpers.arrayElement(['GUEST', 'MODERATOR']),
                profile: randomProfile._id,
                server: server._id
            });
            const savedMember = await member.save();
            await Server.findByIdAndUpdate(server._id, { $push: { members: savedMember._id } });
            members.push(savedMember);
        }
    }
    return members;
};

const generateMessages = async (channels, members) => {
    const messages = [];
    for (const channel of channels) {
        for (let i = 0; i < 10; i++) {
            const message = new Message({
                content: faker.lorem.sentence(),
                fileUrl: "",
                member: faker.helpers.arrayElement(members)._id,
                channel: channel._id
            });
            messages.push(message.save());
        }
    }
    return Promise.all(messages);
};

// Seed the data
const seedDatabase = async () => {
    try {

        // Generate fake data
        const profiles = await generateProfiles(100);
        const servers = await generateServers(profiles, 3);
        const channels = await generateChannels(servers, 3);
        const members = await generateMembers(servers, profiles);
        await generateMessages(channels, members);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error while seeding the database:', error);
        process.exit(1);
    }
};

seedDatabase();