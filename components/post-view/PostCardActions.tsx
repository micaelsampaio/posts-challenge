import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { PostData } from '../../services/posts.service'

type Props = {
  post: PostData,
  className: string
}

export const PostCardActions: FunctionComponent<Props> = ({ className, post }) => {
  const { commentsCount = 0 } = post;

  return (
    <div className={`${className || ""} d-flex`}>
      <Link href={`/post/${post.slug}`}>
        <ActionButton>
          <ActionButtonIcon image="/images/posts/comments.svg" /> <span>{commentsCount}</span>
        </ActionButton>
      </Link>
      <Link href={`/post/${post.slug}`}>
        <ActionButton>
          <ActionButtonIcon image="/images/posts/reply.svg" /> <span>Comment</span>
        </ActionButton>
      </Link>
      <ActionButton>
        <ActionButtonIcon image="/images/posts/share.svg" /> <span>Share</span>
      </ActionButton>
    </div>
  )
}


export const ActionButtonIcon = styled.div<any>`
  width: 12px;
  height: 12px;
  background: rgba(0, 0, 0, 0.6) !important;
  -webkit-mask-image:  url('${props => props.image}');
  mask-image: url('${props => props.image}');
  mask-size: contain;
  margin-right: 5px;
`

export const ActionButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: none;
  margin-right: 2rem;
  padding: 0px;
  background-color: transparent;
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.6) !important;

  &:hover{
  color: rgba(0, 0, 0, 1) !important;
  }
  &:hover ${ActionButtonIcon}{
    background-color: rgba(0, 0, 0, 1) !important;
  }
`