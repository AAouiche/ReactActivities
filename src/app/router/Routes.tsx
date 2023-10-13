import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDash from "../../features/activities/dashboard/ActivityDash";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../Errors/TestError";
import NotFound from "../Errors/NotFound";
import Login from "../Authentication/Login";
import Debug from "../Debug/Debug";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
           
            {path: 'activities', element: <ActivityDash/>},
            {path: 'activity/:id', element: <ActivityDetails/>},
            {path: 'createActivity', element: <ActivityForm key = 'create'/>},
            {path: 'editActivity/:id', element: <ActivityForm key = 'edit'/>},
            {path: 'error', element: <TestErrors/>},
            {path:'not-found', element: <NotFound />},
            {path:'login', element: <Login />},
            {path:'debug', element: <Debug />},
            {path:'*', element: <Navigate replace to ='/not-found'/>}
               
        ]
    }
]

export const router = createBrowserRouter(routes)

