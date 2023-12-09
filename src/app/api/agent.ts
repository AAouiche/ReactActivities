import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";

import { router } from "../router/Routes";
import { User } from "../models/user";
import { form } from "../models/form";

import { EditUser } from "../models/editUser";
import { PaginatedResult } from "../models/PaginatedResult";

//const navigate = useNavigate();

axios.defaults.baseURL = 'https://newactivityproject-production-47a4.up.railway.app';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

axios.interceptors.response.use(
    async (response) => {
        delay(500);
        return response;
    },
    (error:AxiosError) => {
        console.error("Error object:", error); 
        
        if (error.response) {
            console.error("Server Error:", error.response.data);
            const response = error.response as AxiosResponse

            switch (response.status) {
                case 400:
                    const errorMessage = response.data || 'Bad request error';
                    toast.error(errorMessage);
                if (response.data.stackTrace) {
                    const modalStateErrors = response.data.stackTrace.split(',');
                   
                   
                    console.log(modalStateErrors);
            
                  
                    throw modalStateErrors.flat();
                } else {
                  
                    console.error('Error 400 without stackTrace:', response.data);
                    throw new Error('Error 400 without stackTrace');
                }
                
                case 401:
                   toast.warn(response.data.error || 'You are not authorized to access this resource or perform this operation.');
                    break;
                case 403:
                    toast.warn("Forbidden. You don’t have permission to perform this operation.");
                    break;
                case 404:
                    //toast.error("Resource not found.");
                    router.navigate('not-found'); 
                    break;
                default:
                   toast.error("An unexpected server error occurred.");
            }
        } else {
            console.error("Error Message:", error.message); 
            toast.error("An error occurred.");
        }
        
        return Promise.reject(error);
    }
);







const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {},headers?:any) => axios.post(url, body, { headers }).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const Activities = {
    list: (pageNumber:number, pageSize:number, filter = 'all', selectedDate: Date | null = null) => 
        requests.get(`/Activity/List?pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}&selectedDate=${selectedDate ? selectedDate.toISOString() : ''}`),
    details: (id: string): Promise<Activity> => requests.get(`/Activity/${id}`), 
    create: (activity: Activity) => 
    requests.post('/Activity/Create', activity).catch((error) => {
       
        console.error("api call: ", error);

        
        throw error;
    }),
    edit: (activity: Activity) => requests.put('/Activity/Edit', activity), 
    delete: (id: string) => requests.delete(`/Activity/Delete/${id}`),
    attend:(id:string) => requests.post(`/Activity/Attending/${id}`,{}),
    testCreate: (body = {}, headers = {}) => requests.post('/Activity/TestCreate', body, headers)
}
const Account ={
    LoggedIn: ():Promise<User>=> requests.get('/Account/getUser'),
    login: (user:form) => requests.post('Account/login',user),
    register: (user:form) => requests.post('Account/register',user),
    edit: (user:EditUser) => requests.post('Account/Edit',user),
    validateToken: (token:string) => requests.post('Account/ValidateToken',{ Token: token })
    
}
const Image = {
    upload: (formData: FormData) => requests.post('/Image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
};

const agent = {
    Activities,
    Account,
    Image
}
export default agent;