import UsersData from "../models/user.js";

const getRoomId = async (req, res) => {
  const session_id = req.query.id;

  try {
    const data = UserData.findOne({ _id: id });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export default getRoomId;
