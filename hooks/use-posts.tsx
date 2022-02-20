import { useEffect } from "react"
import { useCallback, useState } from "react"
import { IPostsService, PostData, PostDataList, PostsService, PostViewData, ServerResult, ServerResultType } from "../services/posts.service"
import { SOCKET_EVENTS } from "../types/constants"
import { IAppServices } from "./use-services"


export const usePosts = (services: IAppServices): UsePostsReturn => {
  const [posts, setPosts] = useState<ServerResult<Array<PostData>>>({ status: ServerResultType.IDLE, data: [] })
  const [hasNewPosts, setNewPosts] = useState<boolean>(false);

  const fetchPosts = useCallback(async () => {
    try {
      setPosts({ data: [], status: ServerResultType.LOADING });
      const data = await services.postsService.getPosts();
      setPosts({ data: data.posts, status: ServerResultType.SUCCESS });
    } catch (error) {
      setPosts({ data: [], error, status: ServerResultType.ERROR });
    }
  }, [posts, services]);

  const appendPost = useCallback((newPost: PostData) => {
    setPosts(posts => ({ ...posts, data: [newPost, ...posts.data] }));
  }, [setPosts])

  useEffect(() => {
    const onNewComment = ({ postId }: any) => {
      const id = Number(postId);
      const post = posts.data.find(findPost => findPost.id === id)
      if (post) post.commentsCount += 1;
      setPosts((old: any) => ({ ...old, posts: [...posts.data] }));
    }
    const onNewPost = ({ postId }: any) => {
      setNewPosts(true)
    }

    services.eventBus.subscribe(SOCKET_EVENTS.NEW_POST, onNewPost);
    services.eventBus.subscribe(SOCKET_EVENTS.NEW_COMMENT, onNewComment);

    return () => {
      services.eventBus.unsubscribe(SOCKET_EVENTS.NEW_POST, onNewPost);
      services.eventBus.unsubscribe(SOCKET_EVENTS.NEW_COMMENT, onNewComment);
    }
  }, [posts, services]);

  return {
    posts,
    appendPost,
    fetchPosts
  }
}

type UsePostsReturn = {
  posts: ServerResult<Array<PostData>>,
  appendPost(post: PostData): void,
  fetchPosts(): Promise<void>
}

