const http = require("http");
const server = http.createServer();
const { Server } = require("socket.io");

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
let url;
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:3001";
  // Code to run in development environment
} else {
  url = "http://erp2.ceyinfo.cloud";

  // Code to run in production environmentds
}

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3005", // Update with your frontend URL
    origin: url, // Update with your frontend URL
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected:  ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("request_new_org", (data) => {
    console.log("data", data);
    socket.to(data.room).emit("receive_request_new_org", data);
  });

  socket.on("logging", (data) => {
    // console.log("data",data,)d
    socket.to(data.room).emit("receive_logging", data);
  });

  socket.on("logout", (data) => {
    // console.log("data",data,)
    socket.to(data.room).emit("receive_logout", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnecting", (data) => {
    console.log("A user disconnected: " + data);
  });

  socket.on("disconnect", (a) => {
    console.log("A user disconnected: " + socket.id);
    console.log("a: " + a);
  });
});

server.listen(5000, () => {
  console.log("WebSocket server is running on port 5000");
});
