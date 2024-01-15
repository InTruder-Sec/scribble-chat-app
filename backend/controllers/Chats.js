import sdk from "node-appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite";
import { writeFile, unlink } from "fs/promises";
import { UserHistoryMap } from "./../utils/UserHistoryMap.js";
import { CreateNewChat } from "../utils/CreateNewChat.js";
import UsersData from "../models/user.js";
import { PushToAppwrite } from "../utils/PushToAppwrite.js";

// Init SDK
const client = new sdk.Client();

const storage = new sdk.Storage(client);


client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65a5452276df1de24e07")
  .setKey(process.env.API_KEY);
  
export const ChatHandeler = async (req, res) => {
  const data = req.body.svg;
  try {
    const promise = writeFile("temp/image.png", data).then(() => {
      storage.createFile(
        process.env.BUCKET_ID,
        ID.unique(),
        InputFile.fromPath("temp/image.png", "image.png")
      ).then(async (response) => {
        // unlink("temp/image.png");
          console.log(response)
          const URL = `https://cloud.appwrite.io/v1/storage/buckets/${response.bucketId}/files/${response.$id}/view?project=65a5452276df1de24e07`;
          // User Details

          let S_ID = req.body.SessionUser.id;
          let S_USERNAME = req.body.SessionUser.username;
          let d = await UsersData.findById(S_ID);
          let R_ID = req.body.ReciverDetails.id;
          let S_CH = d.chat_history;
          let R_USERNAME = req.body.ReciverDetails.username;
          //   Check whether the chat history of user exist ? Update the document : Create an new object inside the same document
          let DoesExist = await UserHistoryMap(S_CH, R_USERNAME);
          if (DoesExist) {
            // Update the document, Other Users's Chat History
            PushToAppwrite(DoesExist, S_ID, URL);
            await res
              .status(200)
              .json({ message: "Chat successfilly added!", ImageUrl: URL });
            // PushMessage to history in appwrite database
          } else {
            // Create new Document, Add to current, other users's Chat History
            let socketId =
              "id" + new Date().getTime() + Math.random().toString(32).slice(2);
            CreateNewChat(R_ID, S_ID, URL, S_USERNAME, R_USERNAME, socketId);
            await res
              .status(200)
              .json({ message: "Chat successfilly added!", ImageUrl: URL });
          }
      }).catch((err) => {
        console.log(err);
      }
      );
    }
    );
  } catch (err) {
    console.log(err);
    res.status(501).json({ messeage: "Internal server occured" });
  }
};
