import React from 'react'
import { PostData, ServerResult, ServerResultType } from '../../services/posts.service'
import { PostCard } from '../post-view/PostCard';
import { PostCardActions } from '../post-view/PostCardActions';

type Props = {
  data: ServerResult<Array<PostData>>
}

export const PostsList = ({ data }: Props) => {
  const { data: posts, status } = data;

  if (status === ServerResultType.LOADING || status === ServerResultType.IDLE) return <div>Loading...</div>

  return (
    <div>
      {posts.map((post: PostData) =>
        <div className='mt-3' key={"post_" + post.id}>
          <PostCard className="pb-0" data={post}>
            <PostCardActions className='pt-3' post={post} />
          </PostCard>
        </div>)}
    </div>
  )
}