import Link from 'next/link';
import React, { FunctionComponent, memo } from 'react'
import { useParseContent } from '../../hooks/use-parse-content';
import { PostData } from '../../services/posts.service';


const PostText: FunctionComponent<IRenderPostData> = memo(({ post }) => {
  const { slug } = post;
  const content = useParseContent(post.content);

  return <Link href={"/post/" + slug}><div className='cursor-pointer'>{content}</div></Link>
})

const PostImage: FunctionComponent<IRenderPostData> = memo(({ post }) => {

  const { content, slug } = post;

  return <Link href={"/post/" + slug}>
    <img className='w-100 mt-2 cursor-pointer' alt={post.title} style={{ borderRadius: '12px' }} src={content} />
  </Link>
})

const PostUrl: FunctionComponent<IRenderPostData> = memo(({ post }) => {
  const { content } = post;

  return <a href={content} target="_blank">{content}</a>
})


export const POST_RENDERS: { [key: string]: FunctionComponent<IRenderPostData> } = {
  default: PostText,
  post: PostText,
  image: PostImage,
  url: PostUrl
}

export interface IRenderPostData {
  post: PostData
}