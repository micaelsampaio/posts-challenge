import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { useParseContent } from '../../hooks/use-parse-content';
import { useUser } from '../../hooks/use-user'
import { CommentData } from '../../services/comments.service'
import { ServerResultType } from '../../services/posts.service';
import { AddCommentPost } from '../post-view/AddComment';
import { PostThumbnail } from '../post-view/PostCard';
import { ActionButton, ActionButtonIcon } from '../post-view/PostCardActions';
import { CommentsList } from './CommentsList';

type Props = {
  data: CommentData
  className?: string
}

export const CommentRow: FunctionComponent<Props> = memo(({ className, data }) => {
  const { user: username } = data;
  const { picture: { thumbnail } } = useUser(username);
  const { isReplying, reply, stopReply, replyStatus, replaySetStatus } = useReply(data.id);
  const content = useParseContent(data.content);

  return (
    <CommentRowContainer className={className}>
      <div className="d-flex">
        <div className="flex-shrink-1">
          <PostThumbnail image={thumbnail} />
        </div>
        <div className="flex-grow-1">
          <div className="comment-info">
            <span className="username">{username}</span>
            <span className="date">{data.date}</span>
          </div>
          <div className="comment-content">
            {content}
          </div>
          <div className="comment-actions">

            <ActionButton onClick={reply}>
              <ActionButtonIcon image="/images/posts/reply.svg" /> <span>Reply</span>
            </ActionButton>

            {isReplying && <div>
              <AddCommentPost postId={data.postId} commentId={data.id} disabled={replyStatus === ServerResultType.LOADING} onCancelClick={stopReply} onStatusChange={replaySetStatus} />
            </div>}

          </div>

          {
            data.comments && data.comments.length > 0 && (
              <div className='comment-replies'>
                <CommentsList comments={data.comments} />
              </div>
            )
          }

        </div>
      </div>
    </CommentRowContainer>
  )
});

type ReplayInfo = {
  isReplying: boolean
  reply(): void
  stopReply(): void
  replyStatus: ServerResultType
  replaySetStatus(status: ServerResultType): void
}

const useReply = (id: number): ReplayInfo => {
  const [status, setStatus] = useState<ServerResultType>(ServerResultType.IDLE);
  const [replying, setReplying] = useState(false);

  const reply = () => {
    window.dispatchEvent(new CustomEvent("post_view_set_comment_reply", { detail: id }));
    setReplying(true);
  }
  const stopReply = () => {
    window.dispatchEvent(new CustomEvent("post_view_set_comment_reply", { detail: undefined }));
  }

  useEffect(() => {
    if (status === ServerResultType.SUCCESS) {
      stopReply();
    }
  }, [status]);

  useEffect(() => {

    if (replying) {
      const onReplyChange = (evt: any) => {
        if (String(evt.detail) !== String(id)) {
          setReplying(false);
          setStatus(ServerResultType.IDLE);
        }
      };

      window.addEventListener("post_view_set_comment_reply", onReplyChange);
      return () => {
        window.removeEventListener("post_view_set_comment_reply", onReplyChange);
      }
    }

  }, [id, replying]);

  return { isReplying: replying, reply, stopReply, replyStatus: status, replaySetStatus: setStatus };
}


const CommentRowContainer = styled.div`
  .comment-info{
    font-weight: 600 !important;
    margin-left: 10px;
    font-size: 1rem;
    opacity: 0.8;

    .date{
      opacity: 0.6;
      margin-left: 10px;
      font-size: 0.8rem;
    }
  }

  .comment-content{
    margin-left: 10px;    
    font-size: 1.125rem;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .comment-actions{
    margin-left: 10px;    
  }
`