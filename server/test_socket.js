const io = require("socket.io-client");

const socket1 = io("http://127.0.0.1:5000");
const socket2 = io("http://127.0.0.1:5000");

const ROOM_ID = "65bf7a2f9c9a1b2c3d4e5f67"; // Valid 24-char hex string

console.log("Starting Socket Test...");

socket1.on("connect", () => {
    console.log("Socket 1 Connected:", socket1.id);
    socket1.emit("join_room", ROOM_ID);
});

socket2.on("connect", () => {
    console.log("Socket 2 Connected:", socket2.id);
    socket2.emit("join_room", ROOM_ID);

    // Wait a bit for joins to happen then send message
    setTimeout(() => {
        console.log("Socket 2 sending message...");
        socket2.emit("send_message", {
            chatRoomId: ROOM_ID,
            senderId: "65bf7a2f9c9a1b2c3d4e5f68", // Valid ObjectId
            text: "Hello from Socket 2",
            type: "text"
        });
    }, 1000);
});

socket1.on("receive_message", (data) => {
    console.log("SUCCESS: Socket 1 received message:", data);
    process.exit(0);
});

// Timeout if no message received
setTimeout(() => {
    console.log("FAILURE: Timeout waiting for message.");
    process.exit(1);
}, 5000);
