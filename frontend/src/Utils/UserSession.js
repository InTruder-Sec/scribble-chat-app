import endpoint from "..";

const CheckSession = async (setloading) => {
  const token = getCookie("token")
  try {
    const data = await fetch(`${endpoint}/users/session`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "token": token, 
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

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default CheckSession;
