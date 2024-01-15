import endpoint from "..";

// User Search function
const SearchForUser = async (val, setsearchData) => {
  try {
    const data = await fetch(
      `${endpoint}/users/search?username=${val}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await data.json();
    setsearchData(res);
  } catch (err) {
    console.log(err);
  }
};

export default SearchForUser;
