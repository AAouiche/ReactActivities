import { makeAutoObservable, reaction, runInAction } from "mobx";
import { User } from "../models/user";
import { form } from "../models/form";
import agent from "../api/agent";
import axios from "axios";
import { rootStore, useStore } from "./rootStore";


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
           
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            
          
            const loggedInUser = await agent.Account.LoggedIn();
            console.log('Got user details:', loggedInUser);
            runInAction(() => {
              console.log("initlise user")
              this.user = loggedInUser;
              
              this.isLoggedIn = true;
              this.loading = false;
            });
          }else{
            runInAction(() => {
              
              this.loading = false;
            });
          }
        } catch (error) {
          console.error('Failed to initialize user:', error);
          
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
            //this.loading = true;
            console.log(imageFile);
    
            const formData = new FormData();
            formData.append('imageFile', imageFile);  
    
            const response = await agent.Image.upload(formData);
            
            runInAction(() => {
              console.log(this.user?.imageUrl);
                  
                    this.user!.imageUrl = response.url; 
                    rootStore.activityStore.activityMap;
                
                console.log(this.user?.imageUrl);
                
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            
        } finally{
          console.log("final",this.user?.imageUrl);
        }
        
    }
}