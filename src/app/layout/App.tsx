import React, { useContext, useEffect, useState } from 'react';

import NavBar from './NavBar';
 import '../../css/App.css';

import { StoreContext, useStore } from '../Stores/rootStore';
import LoadingComponent from './LoadingComponent';
import {  observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';


function App() {
    
    const location = useLocation();
    
    const { activityStore, userStore } = useStore();
    
    
    useEffect(() => {
        if (userStore.isLoggedIn) {
            activityStore.loadActivities();
            console.log('called');
        } else {
            
            activityStore.clearActivities(); 
        }
    }, [activityStore, userStore.isLoggedIn]); 
    
    
    if (activityStore.loading ) return <LoadingComponent content='Loading app...' />

    return (
        <>
        <ToastContainer position='bottom-right'/>
        {location.pathname === '/' ? <HomePage/> :(
            <div className="App">
            <NavBar/>
            <Outlet/>
        </div>
        )}
        
        </>
        
    );
}

export default observer(App);
