import { ReactSketchCanvas } from "react-sketch-canvas";
import "./UserChats.css";
import send from "./../../images/send.png";
import { UserDetailsGlobal, CurrentUserDetailsGlobal } from "./Messenger";
import { useContext, useEffect, useRef, useState } from "react";
import { SvgUpload } from "../../Utils/SendChats";
import GetChats from "../../Utils/GetChats";
import { ReciverChats, SenderChats } from "./ChatDesigns";
import socketIO from "socket.io-client";
import endpoint from "../../index.js";

function UserChats(props) {
  const [isLoading, setIsLoading] = useState(false);


  // Logged in user details
  let SessionUser = useContext(UserDetailsGlobal);
  const CurrentUser = useContext(CurrentUserDetailsGlobal);

  const [roomId, setroomId] = useState("");
  const socket = socketIO.connect(endpoint);

  // Reciver user Details
  const [ReciverDetails, setReciverDetails] = useState({});

  // Get Chats from databaseId and set Chats
  const [resultChats, setresultChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      await GetChats(props.databaseId, setresultChats, SessionUser);
      var elem = document.getElementById("chat--container");
      elem.scrollIntoView({ behavior: "smooth" });
      // scroll to top
      elem.scrollTop = elem.scrollHeight;
    };
    fetchChats();
  }, [props.databaseId, SessionUser]);

  const mappingChat = resultChats.map((e) => {
    try {
      const ObjectData = JSON.parse(e);
      if (ObjectData.sendersId === SessionUser.id) {
        return <ReciverChats pngData={ObjectData.imgLink} />;
      } else {
        return <SenderChats pngData={ObjectData.imgLink} />;
      }
    } catch (err) {
      return <div></div>;
    }
  });

  useEffect(() => {
    setReciverDetails({
      id: props.id,
      username: props.username,
    });
  }, [props]);

  // Canvas settings
  const styles = {
    zIndex: 4,
  };

  const sketchRef = useRef(null);

  const ClearHandler = () => {
    sketchRef.current.clearCanvas();
  };

  const UndoHandler = () => {
    sketchRef.current.undo();
  };

  const RedoHandler = () => {
    sketchRef.current.redo();
  };

  const EraserHandler = (status) => {
    sketchRef.current.eraseMode(status);
  };

  useEffect(() => {
    fetch(
      `${endpoint}/users/getroomid?user=${CurrentUser.username}&id=${SessionUser.id}`
    ).then((e) => {
      e.json().then((data) => {
        setroomId(data.roomId);
        socket.emit("join-room", data.roomId);
      });
    });

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("receive-message", (data) => {
      if (data.message.sendersId !== SessionUser.id) {
        setresultChats([...resultChats, JSON.stringify(data.message)]);
      }
      var elem = document.getElementById("chat--container");
      elem.scrollTop = elem.scrollHeight;
      elem.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket.io server");
    });
  }, [CurrentUser, SessionUser, socket, resultChats]);

  function SVGhandler() {
    sketchRef.current.exportImage("png").then((data) => {
      if(!isLoading) {
        setIsLoading(true);
        SvgUpload(data, SessionUser, ReciverDetails).then(async (e) => {
          e.json().then(async (data) => {
            const newChat = { imgLink: data.ImageUrl, sendersId: SessionUser.id };
            socket.emit("send-message", {
              room: roomId,
              message: newChat,
            });
            if (resultChats === []) {
              setresultChats([JSON.stringify(newChat)]);
            } else {
              setresultChats([...resultChats, JSON.stringify(newChat)]);
            }
            sketchRef.current.clearCanvas();
            var elem = document.getElementById("chat--container");
            elem.scrollTop = elem.scrollHeight;
            elem.scrollIntoView({ behavior: "smooth" });
            setIsLoading(false);
          });
        });
      } 
      
    });
  }

  return (
    <div className="userchats">
      <div className="user--profile--chats">
        <div className="user--logo">{props.username[0].toUpperCase()}</div>
        <div className="user--information padding--left">
          <div className="limitlength user--name">{props.username}</div>
          <div className="limitlength user--email">{props.lastActive}</div>
        </div>
      </div>
      <div className="chats--space" id="chat--container">
        {mappingChat}
      </div>
      <div className="chat--tools">
        <div className="scribble--pad--tools">
          <ReactSketchCanvas
            ref={sketchRef}
            style={styles}
            width="100%"
            height="100%"
            strokeWidth={4}
            strokeColor="black"
            canvasColor="white"
          />
        </div>
        <div className="tools">
          <div
            className="tools--btn pen"
            onClick={(e) => {
              EraserHandler(false);
            }}
          >
            Pen
          </div>
          <div
            className="tools--btn eraser"
            onClick={(e) => {
              EraserHandler(true);
            }}
          >
            Eraser
          </div>
          <div className="tools--btn clearall" onClick={ClearHandler}>
            Clear All
          </div>
          <div className="tools--btn redo" onClick={RedoHandler}>
            Redo
          </div>
          <div className="tools--btn undo" onClick={UndoHandler}>
            Undo
          </div>
        </div>
        <div className="send" onClick={SVGhandler}  >
          <img className="send--img" alt="send" src={send} style={
            {filter: `${isLoading ? "grayscale(100%)" : "grayscale(50%)"}, ${isLoading ? "brightness(0.5)" : "opacity(0.5)"}`
          }
          } ></img>
        </div>
      </div>
    </div>
  );
}

export default UserChats;
