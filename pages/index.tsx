import type { NextPage } from 'next'
import styled, { createGlobalStyle } from 'styled-components';
import { Main } from '../components/layout/Main';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header/Header';
import { UseAppContext } from '../hooks/use-app-context';
import { useCallback, useEffect } from 'react';
import { PostsList } from '../components/posts/PostsList';
import { CreatePost } from '../components/create-post/CreatePost';

const GlobalStyle = createGlobalStyle`
 h1 {
   font-size: 4rem;
 }
`;
const Container = styled.div`
  text-align: center;
`;

const Home: NextPage = (props) => {

  const { fetchPosts, user, posts } = UseAppContext();

  const fetchAllPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts, posts])

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return <Main>
    <Header />

    <div className="container mt-2">
      <div className="row">
        <div className="col-sm-9">
          <div className="pt-2 pb-2">
            <CreatePost />
          </div>

          <PostsList data={posts} />
        </div>
        <div className="col-sm-3">
          <Footer />
        </div>
      </div>
    </div>
  </Main>
}

export default Home
