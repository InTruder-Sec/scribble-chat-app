import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const endpoint = "https://scribble-chat-app.onrender.com/";
// const endpoint = "http://localhost:8080";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default endpoint;
