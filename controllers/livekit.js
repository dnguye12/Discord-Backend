const livekitRouter = require("express").Router()
const { AccessToken } = require("livekit-server-sdk");
const config = require('../utils/config');

livekitRouter.get('', async(req, res) => {
    const {room, username} = req.query

    if (!room || !username) {
        return res.status(400).json({ error: "Missing 'room' or 'username' in query parameters" });
    }

    try {
        const at = new AccessToken(config.LIVEKIT_API_KEY, config.LIVEKIT_API_SECRET, {
            identity: username,
            ttl: '10m',
        })

        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true,
            canSubscribe: true,
        });

        const token = await at.toJwt();

        return res.json({ token });
    }catch (error) {
        console.error("Error generating LiveKit token:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = livekitRouter;