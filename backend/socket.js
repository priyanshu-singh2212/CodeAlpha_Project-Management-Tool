let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Debug all events
    socket.onAny((event, ...args) => {
      console.log("EVENT RECEIVED =", event, args);
    });

    // ========================
    // USER ROOM JOIN (IMPORTANT)
    // ========================
    socket.on("joinUser", (userId) => {
      if (!userId) return;

      socket.join(`user_${userId}`);
      console.log(`Joined user room: user_${userId}`);
    });

    // ========================
    // PROJECT ROOM JOIN
    // ========================
    socket.on("joinProject", (projectId) => {
      if (!projectId) return;

      socket.join(`project_${projectId}`);
      console.log(`Joined project room: project_${projectId}`);
    });

    // ========================
    // LEAVE PROJECT ROOM
    // ========================
    socket.on("leaveProject", (projectId) => {
      if (!projectId) return;

      socket.leave(`project_${projectId}`);
      console.log(`Left project room: project_${projectId}`);
    });

    // ========================
    // DISCONNECT
    // ========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// ========================
// SAFE IO GETTER
// ========================
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};