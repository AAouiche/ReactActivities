import React, { useEffect, useState } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/Stores/rootStore";
import { NavLink, useParams } from 'react-router-dom';
import ActivityStore from "../../../app/Stores/activityStore";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";

function ActivityDetails() {
    const { id } = useParams();
    console.log(id);
    const { activityStore } = useStore();
    
    
    useEffect(() => {
        console.log('before');
        if (id) {
            activityStore.loadActivity(id);
        }
        console.log('after');
      }, [id]);

      const activity = activityStore.getActivity(id!);

      if (activityStore.loading ) return <LoadingComponent content='Loading app...' />
      if (!activity) return <div>Activity not found</div>; 
    if(activity){
        return (
            <Card>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} alt="Activity Image" />
                <Card.Content>
                    <Card.Header>{activity.title}</Card.Header>
                    <Card.Meta>
                        <span>{activity.date}</span>
                    </Card.Meta>
                    <Card.Description>
                        {activity.description}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group widths='2'>
                        <Button basic color='red' content='Edit'  as={NavLink} 
                                        to={`/editActivity/${activity.id}`}/>
                        <Button basic color='green' content='Cancel' />
                    </Button.Group>
                </Card.Content>
            </Card>
        );
    }
    
}

export default ActivityDetails;