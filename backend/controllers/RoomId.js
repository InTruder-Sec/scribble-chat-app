import UsersData from "../models/user.js";

const getRoomId = async (req, res) => {
  const userName = req.query.user;
  const id = req.query.id;
  try {
    UsersData.findOne({ username: userName }).then((data) => {
      data.chat_history?.map((e) => {
        if (e.userId == id) {
          res.status(200).json({ message: "OK", roomId: e.socketId });
          return;
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export default getRoomId;
