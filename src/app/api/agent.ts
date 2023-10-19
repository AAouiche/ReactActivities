import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import {  useNavigate, useParams } from 'react-router-dom';
import { router } from "../router/Routes";
import { User } from "../models/user";
import { form } from "../models/form";

//const navigate = useNavigate();

axios.defaults.baseURL = 'https://localhost:44335/api';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

axios.interceptors.response.use(
    async (response) => {
        await delay(1000);
        return response;
    },
    (error:AxiosError) => {
        console.error("Error object:", error); // Log the entire error object
        //const{data,status} = error.response as AxiosResponse;
        if (error.response) {
            console.error("Server Error:", error.response.data);
            const response = error.response as AxiosResponse

            switch (response.status) {
                case 400:
                    
                if (response.data.stackTrace) {
                    const modalStateErrors = response.data.stackTrace.split(',');
            
                    // Log error messages for debugging
                    console.log(modalStateErrors);
            
                    // Throw errors so that they can be caught and handled upstream.
                    throw modalStateErrors.flat();
                } else {
                   // toast.error(response.data);
                    // Optionally log or throw the error as well
                    console.error('Error 400 without stackTrace:', response.data);
                    throw new Error('Error 400 without stackTrace');
                }
                break;
                case 401:
                   // toast.warn("You're not authorized to access this resource or perform this operation.");
                    break;
                case 403:
                    //toast.warn("Forbidden. You don’t have permission to perform this operation.");
                    break;
                case 404:
                    //toast.error("Resource not found.");
                    router.navigate('not-found'); // Ensure this route exists in your router
                    break;
                default:
                  //  toast.error("An unexpected server error occurred.");
            }
        } else {
            console.error("Error Message:", error.message); // Log a generic error message
            toast.error("An error occurred.");
        }
        
        return Promise.reject(error);
    }
);







const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const Activities = {
    list: (): Promise<Activity[]> => requests.get('/Activity/List'),
    details: (id: string): Promise<Activity> => requests.get(`/Activity/${id}`), 
    create: (activity: Activity) => 
    requests.post('/Activity/Create', activity).catch((error) => {
        // Handle error here
        console.error("api call: ", error);

        // If you need to propagate the error upstream 
        // to handle it in another place, re-throw it
        throw error;
    }),
    edit: (activity: Activity) => requests.put('/Activity/Edit', activity), 
    delete: (id: string) => requests.delete(`/Activity/Delete/${id}`) 
}
const Account ={
    LoggedIn: ():Promise<User>=>requests.get('/Account/getUser'),
    login: (user:form) =>requests.post('Account/login',user),
    register: (user:form) => requests.post('Account/register',user)
    
}

const agent = {
    Activities,
    Account
}
export default agent;