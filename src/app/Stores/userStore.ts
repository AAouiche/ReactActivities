import { makeAutoObservable, reaction, runInAction } from "mobx";
import { User } from "../models/user";
import { form } from "../models/form";
import agent from "../api/agent";
import axios from "axios";
import { useStore } from "./rootStore";


export default class UserStore{
    user:User |null = null;
    token = localStorage.getItem('userToken');
    isLoggedIn = false;  
    loading = false;
    
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
           ;
           this.initializeUser();
    }
    get loggedIn(){

        return this.user;
    }
    login = async (submission: form) => {
      const user = await agent.Account.login(submission);
      runInAction(() => {
          this.user = user;
          this.isLoggedIn = true;
          console.log('Logged in user object:', user);
  
          // Assuming user.token holds the JWT token
          if (user.token) {
              this.setToken(user.token);
              
          }
      });
  };
    register = async (submission:form)=>{
        await agent.Account.register(submission);
    }
    

    setToken = (token:string | null) => {
        if (token) {
            this.token = token;
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
      this.loading = true;
        try {
          const userToken = localStorage.getItem('userToken');
          if (userToken) {
            // Set the Authorization header with the token
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            
            // Fetch user details with the token
            const loggedInUser = await agent.Account.LoggedIn();
            console.log('Got user details:', loggedInUser);
            runInAction(() => {
              console.log("initlise user")
              this.user = loggedInUser;
              
              this.isLoggedIn = true;
              this.loading = false;
            });
          }
        } catch (error) {
          console.error('Failed to initialize user:', error);
          // Handle the error, possibly by setting `this.isLoggedIn` to `false`
          runInAction(() => {
            this.isLoggedIn = false;
            this.loading = false;
          });
        }
      }
      logout = ()=>{
        runInAction(() =>{
          this.user =null;
        this.isLoggedIn=false;
        localStorage.clear()
        })
        
        
      }
      uploadProfileImage = async (imageFile: any) => {
        try {
            this.loading = true;
            console.log(imageFile);
            const formData = new FormData();
formData.append('imageFile', imageFile);  // 'imageFile' should match the parameter name in your controller

const response = await agent.Image.upload(formData);
    
            runInAction(() => {
                // Handle success, you might want to update the user's profile image link in the store.
                // For example, assuming the response contains the URL of the uploaded image:
                // this.user.profileImageUrl = response.imageUrl;
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            // Handle the error as you see fit. You might want to show a notification to the user.
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}