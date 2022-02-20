import Link from 'next/link';
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components';
import { UseAppContext } from '../../hooks/use-app-context';
import { useParseContent } from '../../hooks/use-parse-content';
import { useUser } from '../../hooks/use-user';
import { PostData } from '../../services/posts.service'
import { UserData } from '../../types/user';
import { POST_RENDERS } from '../posts/PostContent';

type Props = {
  data: PostData,
  className?: string
}

export const PostCard: FunctionComponent<Props> = ({ className, data, children }) => {
  const userData = useUser(data.author);

  const { login: { username }, picture: { thumbnail } } = userData as UserData;

  const { title, publish_date, type: postType, slug } = data;

  const PostRender = POST_RENDERS[postType] || POST_RENDERS.default;

  return (
    <PostContainer>
      <div className={`card-body ${className || ''}`}>
        <div className="d-flex">
          <div className="flex-shrink-1 pr-2">
            <PostThumbnail image={thumbnail} />
          </div>
          <div className="post-user-info flex-grow-1">
            <div className='post-username'>
              {username}
            </div>
            <div className='post-date'>
              {publish_date}
            </div>
          </div>
          <div className="flex-shrink-1 pr-2">
            <MoreOptions />
          </div>
        </div>

        <div className="row post-content-container">
          <Link href={"/post/" + slug}>
            <div className="post-title cursor-pointer"><b>{title}</b></div>
          </Link>
          <div className="post-content">
            <PostRender post={data} />
          </div>
        </div>

        {children}
      </div>
    </PostContainer>
  )
}

const MoreOptions = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: rgba(0,0,0,0.5);
  -webkit-mask-image: url('/images/posts/menu-dots.svg');
  mask-image:url('/images/posts/menu-dots.svg');
  mask-size: contain;

  &:hover{
    cursor: pointer;
    background-color: rgba(0,0,0,1.2);
  }
`


type PostcontainerProps = {
  className: string
}

const PostContainer = styled.article.attrs<PostcontainerProps>(props => { return { className: `card ${props.className || ''}` } })`
  border-radius: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  padding: 0.5rem !important;


  .post-content-container{
    margin-top: 0.625rem; // 10px
  }

  .post-username{
    font-size: 1rem;
    color: rgba(0,0,0, 0.8);
  }
  .post-date{
    font-size: 0.8rem;
    color: rgba(0,0,0, 0.6);
    margin-top: -5px;
  }

  .post-title{
    font-size: 1.2rem; // 16px
  }
  .post-content {
    font-size: 1rem; // 14px
  }

  .post-user-info{
    margin-left: 0.625rem;
  }
`

type PostThumbnailProps = {
  size?: string
  image: string
}

export const PostThumbnail = styled.div<PostThumbnailProps>`
  width: ${props => props.size || "36px"};
  height: ${props => props.size || "36px"};
  border-radius: 100%;
  background-image: url('${props => props.image}');
  background-size: contain;
  background-repeat:no-repeat;
`