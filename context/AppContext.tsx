import React from "react";
import { IAppServices } from "../hooks/use-services";
import { PostData, PostDataList, ServerResult } from "../services/posts.service";
import { UserData } from "../types/user";

export const AppContext = React.createContext({});

export interface IAppContext {
  user: UserData,
  users: Array<any>
  getUser(username: string | null): any
  services: IAppServices,
  posts: ServerResult<Array<PostData>>
  appendPost(post: PostData): void,
  fetchPosts(): Promise<PostDataList>
  setLoading(key: string, value: boolean): void
  socket: any
}