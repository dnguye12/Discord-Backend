const { Server } = require('socket.io')

let io

const initSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
            },
            path: "/api/socket/io/"
        })

        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            socket.on("message", (data) => {
                console.log("Received message:", data);
                io.emit("message", data); // Broadcast message to all clients
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        })

        console.log("Socket.IO initialized");
    }

    return io;
}

const getSocket = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call initializeSocket() first.");
    }
    return io;
}

module.exports = { initSocket, getSocket };