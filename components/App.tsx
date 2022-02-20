import React, { FunctionComponent, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { usePosts } from '../hooks/use-posts';
import { useServices } from '../hooks/use-services';
import { useSockets } from '../hooks/use-sockets';
import users from '../static-data/users.json';
import { UserData } from '../types/user';

type Props = {}

const getUser = (username: string | null): UserData => {
  let user: any = undefined;

  if (username) user = users.find((tempUser: any) => (tempUser as UserData).login.username == username);
  if (user) return user as UserData;
  return (users[Math.floor(Math.random() * users.length)] as any) as UserData;
}

export const App: FunctionComponent<Props> = ({ children }) => {
  const [loading, updateLoading] = useState({ loadings: {}, hasLoading: false });
  const [user] = useState(() => getUser(null))
  // const {createSocket, getSocket} = useSockets();

  const services = useServices();
  const { socket } = useSockets({ services, user });
  const { posts, fetchPosts, appendPost } = usePosts(services);

  const setLoading = (key: string, value: boolean) => {
    updateLoading(oldState => {
      const loadings = Object.keys(oldState.loadings);

      if (!value) {
        const newLoadings = loadings.filter((loadingKey: string) => loadingKey !== key);
        return {
          loadings: newLoadings,
          hasLoading: newLoadings.length > 0
        }
      }

      return {
        loadings: [...loadings, key],
        hasLoading: true
      }
    });
  }

  return (
    <AppContext.Provider value={{ posts, user, users, socket, getUser, services, setLoading, appendPost, fetchPosts }}>
      {children}
    </AppContext.Provider>
  )
}