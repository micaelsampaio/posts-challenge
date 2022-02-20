import axios from "axios";
import { useEffect, useState } from "react";
import SocketIOClient from "socket.io-client";
import { IEventBus } from "../services/event-bus.service";
import { SOCKET_EVENTS } from "../types/constants";
import { UserData } from "../types/user";
import { IAppServices } from "./use-services";

type UseSocketsArgs = {
  user: UserData,
  services: IAppServices
}
type UseSockets = {
  socket: any
  socketConnected: boolean
}
export const useSockets = ({ services: { eventBus } }: UseSocketsArgs): UseSockets => {

  const [socket, setSocket] = useState()
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {

    try {
      axios.get("/api/socketio");
    } catch (error) { }

    const socket = (SocketIOClient as any).connect(process.env.BASE_URL, {
      path: "/api/socketio",
      transports: ["websocket"]
    });

    // log socket connection
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("new_post", (data: any) => {
      eventBus.publish(SOCKET_EVENTS.NEW_POST, data);
    })

    socket.on("new_comment", (data: any) => {
      eventBus.publish(SOCKET_EVENTS.NEW_COMMENT, data);
    })

    socket.connect();
    setSocket(socket);

    if (socket) return () => {
      socket.disconnect();
    }
  }, []);


  return { socket, socketConnected: connected }
}