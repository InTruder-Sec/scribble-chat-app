import endpoint from "..";

export async function SvgUpload(data, SessionUser, ReciverDetails) {
  try {
    const res = await fetch(`${endpoint}users/sendChat`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        svg: data,
        SessionUser: SessionUser,
        chat_history: SessionUser.chat_history,
        ReciverDetails: ReciverDetails,
      }),
    });
    return res;
  } catch {
    console.log("Something went wrong!");
  }
}
