import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import NavBar from './NavBar';
import '../../css/App.css';
import ActivityDash from '../../features/activities/dashboard/ActivityDash';
import { Activity } from '../models/activity';

function App() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // Fetching the list of activities from the backend
        axios.get<Activity[]>('https://localhost:44335/api/Activity/List')
             .then(response => {
                 setActivities(response.data);
             })
             .catch(error => {
                 console.error('Error fetching activities:', error);
                 // You might want to set some error state here as well for user feedback
             });
    }, []); // Empty dependency array means this useEffect runs once when the component mounts

    return (
        <div className="App">
            <NavBar/>
            <ActivityDash activities={activities}/>  {/* Assuming you want to pass the fetched activities as a prop */}
        </div>
    );
}

export default App;