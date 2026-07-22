import { io } from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:8080", {
  withCredentials: true
});

socket.on("connect", () => {
  console.log("TEST SCRIPT CONNECTED:", socket.id);
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("TEST SCRIPT CONNECTION ERROR:", err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error("TEST SCRIPT TIMEOUT");
  process.exit(1);
}, 3000);
