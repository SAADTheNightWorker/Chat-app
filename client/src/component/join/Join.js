import "./Join.css";
import Logo from "../../images/1.png";
import { Link } from "react-router-dom";
import { useState } from "react";

let user;

const Join = () => {
  const sendUser = (e) => {
    user = document.getElementById("joinInput").value;
    document.getElementById("joinInput").value = "";
    console.log(user);
  };

  const [input, setInput] = useState("");

  return (
    <div className="joinPage">
      <div className="joinContainer">
        <img src={Logo} alt="chat-Logo" />
        <h1>My Chat</h1>
        <input placeholder="Enter Your Name" onChange={(e) => setInput(e.target.value)} type="text" id="joinInput" />
        <Link onClick={(e) => (!input ? e.preventDefault() : null)} to="/chat">
          <button onClick={sendUser} className="joinbtn">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
export { user };
