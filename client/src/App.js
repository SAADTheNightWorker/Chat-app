import { Route, Routes } from "react-router-dom";
import "./App.css";
import socketIO from "socket.io-client";
import Join from "./component/join/Join.js";
import Chat from "./component/chat/Chat.js";

const EndPoint = "http://localhost:4000";
const socket = socketIO(EndPoint, { transports: ["websocket"] });

function App() {
  socket.on("connect", () => {
    console.log("user is connected");
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </>
  );
}

export default App;
