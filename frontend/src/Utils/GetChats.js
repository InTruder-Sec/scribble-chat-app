import {
  SenderChats,
  ReciverChats,
} from "./../Components/Messenger/ChatDesigns";
import endpoint from "./../index";

const GetChats = async (id, setresultChats, SessionUser) => {
  try {
    const res = await fetch(`${endpoint}users/getchats?id=${id}`);
    const data = await res.json();
    console.log(data.data);
    if (data.data.length === 0) {
      setresultChats([]);
      return;
    }
    setresultChats(data.data);
  } catch (err) {
    console.log("error: " + err);
  }
};

export default GetChats;
