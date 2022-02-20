import axios from "axios"
import { parseDate } from "../scripts/dates-utils";
import { objectToQueryString, stringToSlug } from "../scripts/string-utils";
import { GLOBAL_EVENTS } from "../types/constants";
import { IServiceConstrutor } from "../types/global-types";
import { IEventBus } from "./event-bus.service";


export class CommentsServices implements ICommentsServices {
  private postsApiUrl: string;
  private eventBus: IEventBus;

  constructor({ eventBus }: IServiceConstrutor) {
    const { POST_API_URL = 'http://localhost:9000' } = process.env;
    this.eventBus = eventBus;
    this.postsApiUrl = POST_API_URL;
  }


  async createComment({ user, content, parent_id, postId }: CreateCommentArgs): Promise<CommentData> {
    if (!user) throw new Error("no user")
    if (!postId) throw new Error("no postId")
    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts/${postId}/comments`,
      method: 'POST',
      data: {
        user,
        content,
        parent_id,
        postId,
        date: parseDate()
      }
    });

    this.eventBus.publish(GLOBAL_EVENTS.NEW_COMMENT, data);

    return data as CommentData;
  }

  async getComments({ postId, group = false, sort = "id", order = "asc" }: GetCommentArgs): Promise<Array<CommentData>> {
    const qs = objectToQueryString({ _sort: sort, _order: order })
    const { data } = await axios.request({
      url: `${this.postsApiUrl}/posts/${postId}/comments${qs}`,
      method: 'GET'
    });

    const commentsData = Array.isArray(data) ? data : [];
    if (group) {
      const commentsGroup: Array<CommentData> = [];

      for (let comment of commentsData) {
        comment.comments = [];
        const parent = findParentComment(comment.parent_id, commentsGroup);

        if (parent) {
          comment.level = (parent.level || 1) + 1;
          parent.comments?.push(comment);
        } else {
          comment.level = 1;
          commentsGroup.push(comment);
        }
      }

      return commentsGroup;
    }
    return commentsData;
  }

  appendCommentToCommentsLocal(comments: Array<CommentData>, commentToAdd: CommentData): Array<CommentData> {

    if (commentToAdd.parent_id) {
      const parent = findParentComment(Number(commentToAdd.parent_id), comments);
      if (parent) {
        parent.comments = [commentToAdd, ...parent.comments || []];
      }

      return [...comments];
    }

    return [...comments, commentToAdd]; // create new reference
  }

}

const findParentComment = (id: number | null, comments: Array<CommentData> | null): (CommentData | null) => {
  if (!id || !comments || comments.length === 0) return null;

  for (let comment of comments) {
    console.log(comment.id === id, comment.id, id)
    if (comment.id === id) return comment;
    else {
      const parent = findParentComment(id, comment.comments || null);
      if (parent) return parent;
    }
  }
  return null;
}

export interface ICommentsServices {
  createComment({ user, content, parent_id, postId }: CreateCommentArgs): Promise<CommentData>
  getComments({ postId, group, sort, order }: GetCommentArgs): Promise<Array<CommentData>>
  appendCommentToCommentsLocal(comments: Array<CommentData>, commentToAdd: CommentData): Array<CommentData>
}

export type CommentData = { // Post data and not Post because next Post module :) 
  id: number,
  postId: number,
  parent_id: number | null | undefined,
  user: string
  date: string
  content: string
  comments?: Array<CommentData>
  level?: number // level  in group
}

type CreateCommentArgs = {
  user: string
  content: string
  parent_id?: number | null | undefined
  postId: number
}

type GetCommentArgs = {
  postId: number
  group?: boolean
  sort?: string
  order?: string
}
