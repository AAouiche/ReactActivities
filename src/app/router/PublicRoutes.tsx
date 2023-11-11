import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../Stores/rootStore";

export default function PublicRoute() {
    const { userStore } = useStore();
  
   
    if (userStore.isLoggedIn) {
      return <Navigate to="/activities" />;
    }
  

    return <Outlet />;
  }