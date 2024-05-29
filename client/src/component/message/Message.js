import React from "react";
import "./Message.css";

const Message = ({ message, user, classs }) => {
  if (user) {
   
    return (
      <div className={`msgBox ${classs}`}>
        {`${user}: ${message}`}
        </div>
    );
  } 
  else {
  
    return (
      <div className={`msgBox ${classs}`}>
        {`You: ${message}`}
        </div>
    );
  }
};

export default Message;
