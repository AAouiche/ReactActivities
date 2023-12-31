import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDash from "../../features/activities/Dash/ActivityDash";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../Errors/TestError";
import NotFound from "../Errors/NotFound";
import Login from "../Authentication/Login";
import Debug from "../Debug/Debug";
import Register from "../Authentication/Register";
import PrivateRoute from "./ProtectedRoutes";
import ProfileImageUpload from "../form/ProfileImageUpload";
import UserProfile from "../../features/Profile/UserProfile";
import PublicRoute from "./PublicRoutes";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {
                path: '/',
                element: <PublicRoute/>,
                children: [
                   
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> }
                ]
            },
            {
                path: '/',
                element: <PrivateRoute/>,
                children: [
                    { path: 'activities', element: <ActivityDash /> },
                    { path: 'activity/:id', element: <ActivityDetails /> },
                    { path: 'image', element: <ProfileImageUpload /> },
                    { path: 'createActivity', element: <ActivityForm key='create' /> },
                    { path: 'editActivity/:id', element: <ActivityForm key='edit' /> },
                    { path: 'error', element: <TestErrors /> },
                    { path: 'debug', element: <Debug /> },
                    { path: 'profile', element: <UserProfile /> }
                ]
            },
            { path: 'not-found', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
];

export const router = createBrowserRouter(routes)

