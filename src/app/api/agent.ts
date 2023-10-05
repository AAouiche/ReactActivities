import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

axios.defaults.baseURL = 'https://localhost:44335/api';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
axios.interceptors.response.use(async (response) => {
    
    await delay(2000);
    
    
    return response;
}, async (error) => {
    
    await delay(2000);

    
    return Promise.reject(error);
});

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
    create: (activity: Activity) => requests.post('/Activity/Create', activity),
    edit: (activity: Activity) => requests.put('/Activity/Edit', activity), 
    delete: (id: string) => requests.delete(`/Activity/Delete/${id}`) 
}

const agent = {
    Activities
}
export default agent;