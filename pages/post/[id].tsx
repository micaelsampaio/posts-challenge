import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'
import { Header } from '../../components/layout/Header/Header'
import { AddCommentPost } from '../../components/post-view/AddComment'
import { PostCard } from '../../components/post-view/PostCard'
import { UseAppContext } from '../../hooks/use-app-context'
import { CommentData } from '../../services/comments.service'
import { PostsService, PostViewData, ServerResultType } from '../../services/posts.service'
import { SectionTitle } from '../../components/layout/SectionTitle';
import { CommentsList } from '../../components/comments/CommentsList'
import { GLOBAL_EVENTS } from '../../types/constants'
import Head from 'next/head'
import { Footer } from '../../components/layout/Footer'

const PostView: NextPage = () => {
  const router = useRouter()
  const { id: postSlug } = router.query;
  const { services } = UseAppContext();
  const { postsService } = services;
  const [fetchPostLoading, setFetchPostLoading] = useState<boolean>(true);
  const [fetchCommentsLoading, setFetchCommentsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostViewData | null>(null);
  const [comments, setComments] = useState<Array<CommentData>>([]);
  const [commentStatus, setCommentStatus] = useState<ServerResultType>(ServerResultType.IDLE)

  const fetchPost = async (slug: string) => {
    try {
      setFetchPostLoading(true);
      const data = await postsService.getPost(slug);
      const post = data as PostViewData;
      const { id: postId } = post;
      post.comments = [];
      setPost(post);
      setFetchPostLoading(false);
      fetchPostComments(postId);
    } catch (error) {
      setFetchPostLoading(false);
    }
  }
  const fetchPostComments = async (postId: number) => {
    try {
      setFetchCommentsLoading(true);
      const data = await services.commentsService.getComments({ postId, group: true });
      setComments(Array.isArray(data) ? data : []);
      setFetchCommentsLoading(false);
    } catch (error) {
      setFetchCommentsLoading(false);
    }
  }

  useEffect(() => {
    const onNewComment = (newComment: CommentData) => {
      try {
        const newComments = services.commentsService.appendCommentToCommentsLocal(comments, newComment);
        setComments(newComments);
      } catch (error) { }
    }
    services.eventBus.subscribe(GLOBAL_EVENTS.NEW_COMMENT, onNewComment);
    return () => {
      services.eventBus.unsubscribe(GLOBAL_EVENTS.NEW_COMMENT, onNewComment);
    }
  }, [comments]);

  useEffect(() => {
    if (postSlug) {
      fetchPost(postSlug as string);
    }
  }, [postSlug])

  return <div>
    {!fetchPostLoading && post &&
      <Head>
        {/* // SEO */}
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.title} />
        <meta property="og:url" content={"http://localhost:3000/post/" + post.slug} />
        <meta property="og:type" content="website" />
        <meta property="og:image:url" content={post.type === "image" ? post.content : ''} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPost",
            "name": post.title,
            "url": "http://localhost:3000/post/" + post.slug,
            "image": post.type === "image" ? post.content : '',
            "description": post.title,
            "inLanguage": ["English"],
            "editor": post.author,
            "datePublished": post.publish_date
          })
        }}></script>
        )
      </Head>
    }

    <Header />

    <div className="container">
      <div className="row">
        <div className="col-sm-9">

          <div className="mt-2">
            {!fetchPostLoading && post && <PostCard data={post} />}
          </div>

          <div className="mt-2">

            {!fetchPostLoading && post && <div className='pt-3 pb-3'>
              <AddCommentPost postId={post.id} disabled={commentStatus === ServerResultType.LOADING} onStatusChange={setCommentStatus} />
            </div>}


            <SectionTitle>Comments: </SectionTitle>


            <CommentsList comments={comments} loading={fetchCommentsLoading} error={false} />
          </div>

        </div>

        <div className="col-sm-3">
          <Footer />
        </div>
      </div>
    </div>

  </div >
}

export default PostView
