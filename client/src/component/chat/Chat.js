import React, { useEffect, useState } from "react";
import { user } from "../join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import send from "../../images/send.svg";
import Message from "../message/Message";
import ReactScrollTopToBottom from "react-scroll-to-bottom";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";
import img from "../../images/user-icon.png";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Logo from "../../images/1.png"

const EndPoint = "http://localhost:4000";

let socket;

const Chat = () => {
  const [id, setId] = useState("");
  const [message, setMessage] = useState([]);

  const Send = () => {
    // Get the value of the input field
    const message = document.getElementById("inputInner").value;

    socket.emit("message", { message, id });

    // Clear the input field after sending the message
    document.getElementById("inputInner").value = "";
  };

  useEffect(() => {
    socket = socketIo(EndPoint, { transports: ["websocket"] });
    console.log(socket);

    socket.on("connect", () => {
      console.log(`${user} is connected`);
      setId(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      console.log(data.user, data.message);
      setMessage([...message, data]);
    });

    socket.on("userJoined", (data) => {
      console.log(data.user, data.message);
      setMessage([...message, data]);
    });

    socket.on("leave", (data) => {
      console.log(data.user, data.message);
      setMessage([...message, data]);
    });

    return () => {
      socket.emit("disconnec");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      console.log(data.user, data.message, data.id);
      setMessage([...message, data]);
    });

    return () => {
      socket.off("sendMessage");
    };
  }, [message]);

  const [isNightMode, setIsNightMode] = useState(false);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="chatHeader">
        <img className="logo-img" src={Logo} alt=""/>
          <div>
            <Avatar
              alt="Remy Sharp"
              src={img}
              sx={{ width: 34, height: 34, objectFit: "cover" }}
            />
          </div>
          <p onClick={(e) => setIsNightMode(!isNightMode)} className="mood">
            {isNightMode ? <LightModeIcon className="light"/> : <NightsStayIcon className="dark"/>}
          </p>

          <a href="/">
            <CloseIcon />
          </a>
        </div>

        <ReactScrollTopToBottom className={!isNightMode ? "chatBox" : "nightmood"}>
          {message.map((item, i) => (
            <Message
              key={i}
              message={item.message}
              classs={item.id === id ? "left" : "right"}
              user={item.id === id ? "" : item.user}
            />
          ))}
        </ReactScrollTopToBottom>
        <div className="chatInput">
          <input onKeyPress={(e) => e.key === "Enter" ? Send() : null} id="inputInner" type="text" placeholder="Type a message" />
          <button onClick={Send} className="sendBtn">
            <img src={send} alt="send.svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
