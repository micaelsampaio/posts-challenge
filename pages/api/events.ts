import axios from "axios";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../styles/backend-types";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => { // here was extreme go horse mode :)
  if (req.method === "POST") {
    // get message
    // const { POST_API_URL = 'http://localhost:9000' } = process.env;
    const { event: eventName, data } = req.body;


    switch (eventName) {
      case 'new_post':
        res?.socket?.server?.io?.emit("new_post", { postId: data.id });
        break;
      case 'new_comment':
        res?.socket?.server?.io?.emit("new_comment", { postId: data.postId, commentId: data.commentId });
        break;
    }

    res.status(201).json({});
  }
};
