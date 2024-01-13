import axios from "axios";
import { useEffect, useState } from "react";

const SenderChats = ({ pngData }) => {
  const [image, setimage] = useState("");

  const [loading, setloading] = useState(true);

  useEffect(() => {
    axios.get(pngData).then((res) => {
      setimage(res.data);
      setloading(false);
    });
  }, [pngData]);

  return (
    <>
      <div className="s--chat--main">
        <div className="user--logo">A</div>
        <img
          alt="loading..."
          src={image}
          className={`user--chat--content ${loading ? "skeleton" : ""}`}
        ></img>
      </div>
    </>
  );
};

const ReciverChats = ({ pngData }) => {
  const [image, setimage] = useState("");

  useEffect(() => {
    axios.get(pngData).then((res) => {
      setimage(res.data);
    });
  }, [pngData]);
  return (
    <>
      <div className="s--chat--main reciver">
        <div className="user--logo">A</div>
        <img alt="loading..." className="user--chat--content" src={image}></img>
      </div>
    </>
  );
};

export { SenderChats, ReciverChats };
