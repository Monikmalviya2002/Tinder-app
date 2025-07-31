const { Server } = require("socket.io");
const Chat = require("../models/chat"); 



const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetId }) => {
      const roomId = [userId, targetId].sort().join("_");
      console.log(firstName + " joinedRoom: " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName,lastName ,userId, targetId, text }) => {
      try {
        const roomId = [userId, targetId].sort().join("_");
        console.log(firstName + " " + text);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();
        io.to(roomId).emit("MessageReceived", { firstName,lastName, text });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
