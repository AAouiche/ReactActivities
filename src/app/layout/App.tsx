import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'; 
import NavBar from './NavBar';
 import '../../css/App.css';
import ActivityDash from '../../features/activities/dashboard/ActivityDash';
import { Activity } from '../models/activity';
import agent from '../api/agent';
import { StoreContext, useStore } from '../Stores/rootStore';
import LoadingComponent from './LoadingComponent';
import {  observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';


function App() {
    
    const location = useLocation();
    
    const { activityStore } = useStore();
    const { activityMap } = activityStore;
    
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);
    
    
    if (activityStore.loading ) return <LoadingComponent content='Loading app...' />

    return (
        <>
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
