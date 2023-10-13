import { makeAutoObservable, reaction, runInAction } from "mobx";
import { User } from "../models/user";
import { form } from "../models/form";
import agent from "../api/agent";
import axios from "axios";

export default class UserStore{
    user:User |null = null;
    token = localStorage.getItem('userToken');
    isLoggedIn = false;  
    constructor(){
        makeAutoObservable(this)
        reaction(
            () => this.token,
            token => {
              if(token) {
                localStorage.setItem('userToken',token)
              }else {
                localStorage.removeItem('userToken');
              }
            }
            
           )
           this.initializeUser();
    }
    get loggedIn(){

        return this.user;
    }
    login = async (submission:form)=>{
        const user = await agent.Account.login(submission);
        runInAction(()=> {
            this.user = user
            this.isLoggedIn=true;
            console.log('Logged in user object:', user);
        }
        
        );
        
        console.log('this user',this.user);
    }
    register = async (submission:form)=>{
        await agent.Account.register(submission);
    }

    setToken = (token:string | null) => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    // Call this method in your component's useEffect to ensure the token is set after page refreshes
    loadTokenFromStorage = () => {
        const token = localStorage.getItem('userToken') ;
        if (token) {
            this.setToken(token);
        }
    }
    initializeUser = async () => {
        try {
          const userToken = localStorage.getItem('userToken');
          if (userToken) {
            // Set the Authorization header with the token
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            
            // Fetch user details with the token
            const loggedInUser = await agent.Account.LoggedIn();
            runInAction(() => {
              this.user = loggedInUser;
              
              this.isLoggedIn = true;
            });
          }
        } catch (error) {
          console.error('Failed to initialize user:', error);
          // Handle the error, possibly by setting `this.isLoggedIn` to `false`
          runInAction(() => {
            this.isLoggedIn = false;
          });
        }
      }
      logout = ()=>{
        runInAction(()=> {
        this.user =null;
        localStorage.clear();
        }
      }
}