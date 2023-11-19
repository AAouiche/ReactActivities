import React, { useContext, useEffect, useState } from 'react';

import NavBar from './NavBar';


import { StoreContext, useStore } from '../Stores/rootStore';
import LoadingComponent from './LoadingComponent';
import {  observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
    
    
    if (activityStore.loading || userStore.loading ) return <LoadingComponent content='Loading app...' />

    if (userStore.isLoggedIn && location.pathname === '/') {
        return <Navigate to="/activities" />;
    }

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
