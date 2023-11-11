import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useStore } from '../Stores/rootStore';
import LoadingComponent from '../layout/LoadingComponent';


export default function PrivateRoute() {
  const { userStore } = useStore();
  const location = useLocation();

  
  

 
  if (!userStore.isLoggedIn && !userStore.loading) {
    return <Navigate to="/login" />;
  }



 
  return <Outlet />;
}