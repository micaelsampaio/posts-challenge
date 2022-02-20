import axios from "axios"
import { parseDate } from "../scripts/dates-utils";
import { objectToQueryString, stringToSlug } from "../scripts/string-utils";
import { GLOBAL_EVENTS } from "../types/constants";
import { IServiceConstrutor } from "../types/global-types";
import { CommentData } from "./comments.service";
import { IEventBus } from "./event-bus.service";


export class PostsService implements IPostsService {
  private postsApiUrl: string;
  private eventBus: IEventBus;

  constructor({ eventBus }: IServiceConstrutor) {
    const { POST_API_URL = 'http://localhost:9000' } = process.env;
    this.eventBus = eventBus;
    this.postsApiUrl = POST_API_URL;

    this.eventBus.subscribe(GLOBAL_EVENTS.NEW_COMMENT, this.addCommentToPost.bind(this));
  }

  async getPosts(args: any): Promise<PostDataList> {
    const { order = "desc", sort = "id" } = args || {};
    const qs = objectToQueryString({ _order: order, _sort: sort })

    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts${qs}`,
      method: 'GET'
    });

    const posts: Array<PostData> = data;

    return { posts }
  }

  async getPost(slug: string): Promise<PostData> {
    // if (!slug) throw new Error("invalid slug");
    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts?slug=${slug}`,
      method: 'GET'
    });

    return data[0];
  }
  async getPostById(postId: number): Promise<PostData> {
    if (!postId) throw new Error("invalid postId");

    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts/${postId}`,
      method: 'GET'
    });

    return data[0];
  }

  async getPostComments(postId: number): Promise<Array<any>> {
    // if (!slug) throw new Error("invalid slug");
    const { data } = await axios.request({
      url: `${this.postsApiUrl}/post/${postId}/comments`,
      method: 'GET'
    });

    return data;
  }

  async createPost({ username, title, content, postType }: CreatePostArgs) {

    if (!username) throw new Error("invalid Username");
    if (!title) throw new Error("invalid title");
    if (!content) throw new Error("invalid content");

    let description = content.substring(50);

    const payload = {
      title,
      description,
      content,
      author: username,
      slug: stringToSlug(title),
      publish_date: parseDate(),
      type: postType,
      commentsCount: 0
    } as PostData;

    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts/`,
      method: 'POST',
      data: payload
    });

    this.eventBus.publish(GLOBAL_EVENTS.NEW_POST, data);

    return data;
  }

  async addCommentToPost({ postId }: CommentData): Promise<void> { // this is just to show the functionalilty this code is "bad"
    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts/${postId}`,
      method: 'GET'
    });

    await axios.request({
      url: `${this.postsApiUrl}/posts/${postId}`,
      method: 'PATCH',
      data: {
        commentsCount: (data.commentsCount || 0) + 1
      }
    });
  }
}

export interface IPostsService {
  getPosts(args?: any): Promise<PostDataList>
  getPost(slug: string): Promise<PostData>
  getPostComments(postId: number): Promise<Array<any>>
  createPost({ username, title, content, postType }: CreatePostArgs): Promise<PostData>
}

export type PostData = { // Post data and not Post because next Post module :) 
  author: string
  content: string
  description: string
  id: number
  publish_date: string// "2016-02-23"
  slug: string //"blog-post-1"
  title: string //"Blog post #1"
  commentsCount: number,
  type: string
}


type PostView = {
  comments: Array<any>
}

export type PostViewData = PostView & PostData;

export type PostDataList = { // Post data and not Post because next Post module :) 
  posts: Array<PostData>
}

export type ServerResult<T> = { // Post data and not Post because next Post module :) 
  status: ServerResultType,
  data: T,
  error?: any
}

export enum ServerResultType { IDLE = "idle", SUCCESS = "success", LOADING = "loading", ERROR = "error" }


type CreatePostArgs = {
  title: string
  content: string,
  username: string
  postType: string
}