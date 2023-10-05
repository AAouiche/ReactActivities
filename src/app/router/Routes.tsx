import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDash from "../../features/activities/dashboard/ActivityDash";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
           
            {path: 'activities', element: <ActivityDash/>},
            {path: 'activity/:id', element: <ActivityDetails/>},
            {path: 'createActivity', element: <ActivityForm key = 'create'/>},
            {path: 'editActivity/:id', element: <ActivityForm key = 'edit'/>}
        ]
    }
]

export const router = createBrowserRouter(routes)
