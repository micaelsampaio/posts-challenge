import { useRouter } from 'next/router';
import React, { FunctionComponent, memo, useState } from 'react'
import styled from 'styled-components';
import { UseAppContext } from '../../hooks/use-app-context';
import { CommentData } from '../../services/comments.service';
import { ServerResultType } from '../../services/posts.service';
import { ResizableTextarea } from '../ui/Inputs';
import { PostThumbnail } from './PostCard';

type Props = {
  disabled?: boolean
  postId: number, commentId?: number | null | undefined,
  onStatusChange?(status: ServerResultType, error?: any): void
  onCancelClick?(): void
  notifications?: boolean
}

export const AddCommentPost: FunctionComponent<Props> = memo(({ postId, disabled = false, notifications = true, onStatusChange, onCancelClick, commentId }) => {
  const { user, services } = UseAppContext();

  const [comment, setComment] = useState<string>("");


  const createComment = async () => {
    try {
      if (onStatusChange) onStatusChange(ServerResultType.LOADING);

      await services.commentsService.createComment({ user: user.login.username, postId, content: comment, parent_id: commentId });

      setComment("");

      if (onStatusChange) onStatusChange(ServerResultType.SUCCESS);

      if (notifications) services.notifications.success("Comment posted!");

    } catch (error) {
      if (notifications) services.notifications.error("There was an error creating your comment!", "Error");

      if (onStatusChange) onStatusChange(ServerResultType.ERROR);
    }
  }

  const onClose = () => setComment("");

  if (!postId) return null;

  return (
    <AddCommentContainer>
      <div className="d-flex">
        <div className='thumbnail'>
          <PostThumbnail image={user.picture.thumbnail} />
        </div>
        <div className="flex-grow-1">
          <ResizableTextarea className='form-control w-100' minRows={1} maxRows={10} value={comment} onChange={(e: any) => setComment(e.target.value)} />

          <div className="actions">
            <button className="btn btn-light" onClick={onCancelClick || onClose}>Cancel</button>
            <button disabled={comment.length == 0} className="btn btn-primary" onClick={createComment}>Comment</button>
          </div>
        </div>
      </div>


    </AddCommentContainer>
  )
});

const AddCommentContainer = styled.div<any>`
.thumbnail{
  margin-right: 20px;
}
.actions{
  margin-top: 10px;
  text-align: right;
}
.actions button {
  margin-left: 10px;
}
`
