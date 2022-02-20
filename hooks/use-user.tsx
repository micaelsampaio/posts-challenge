import React, { useEffect, useState } from 'react'
import { UserData } from '../types/user';
import { UseAppContext } from './use-app-context';

export function useUser(username: string): UserData {
  const { getUser } = UseAppContext();
  const [user, setUser] = useState(() => getUser(username));
  (window as any).getUser = getUser;


  useEffect(() => {
    setUser(getUser(username));
  }, [username])

  return user;
}
