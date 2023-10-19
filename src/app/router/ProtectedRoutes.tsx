import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useStore } from '../Stores/rootStore';


export default function PrivateRoute() {
  const { userStore } = useStore(); 

  if (!userStore.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}