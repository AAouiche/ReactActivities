import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useStore } from '../Stores/rootStore';
import LoadingComponent from '../layout/LoadingComponent';


export default function PrivateRoute() {
  const { userStore } = useStore();

  
  

  // If not logged in after initialization, navigate to login.
  if (!userStore.isLoggedIn && !userStore.loading) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the intended protected route.
  return <Outlet />;
}