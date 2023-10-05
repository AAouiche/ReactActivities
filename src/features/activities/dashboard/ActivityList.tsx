import React, { Fragment, useEffect } from "react";
import { Button, Header, Item, Label, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/Stores/rootStore";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ListItem from "./ListItem";

function ActivityList() {
    const { activityStore } = useStore();
    const { activityMap } = activityStore;
    
    function handleDelete(id:string){
        try{
            activityStore.deleteActivity(id);
        }catch(error){
            console.error("Error:", error);
        }
       
    }
    
    return (
        <>
        {activityStore.groupActivitiesByDate.map(([group,activities]) =>(
            <Fragment key={group}>
                <Header color='blue'>
                    {group}
                </Header>
                
            
                {activities.map((activity: Activity) => (
                    <ListItem key={activity.id} activity={activity}/>
                ))}
            
            </Fragment>
        )
        )}
        </>
        
    );
}

export default observer(ActivityList);