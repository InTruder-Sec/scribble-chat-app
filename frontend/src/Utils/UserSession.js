import endpoint from "..";

const CheckSession = async (setloading) => {
  try {
    const data = await fetch(`${endpoint}users/session`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();

    if (res.code === 500) {
      setloading(false);
      return {
        data: { _id: "", username: " ", chat_history: [] },
        code: 500,
        redirect: true,
      };
    } else {
      setloading(false);
      return { data: res.data, code: 200, redirect: false };
    }
  } catch (err) {
    console.log(err);
    return {
      data: { _id: "", username: " ", chat_history: [] },
      code: 500,
      redirect: true,
    };
  }
};

export default CheckSession;
