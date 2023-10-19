import { observer } from 'mobx-react-lite';
import React from 'react'
import {Button, Header, Item, Segment, Image} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { format } from 'date-fns';
import { Attendee } from '../../../app/models/attendee';
import { useStore } from '../../../app/Stores/rootStore';



const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
   
}

export default observer (function ActivityDetailedHeader({activity}: Props) {
    const {activityStore} =useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, 'yyyy-MM-dd HH:mm')}</p>
                                <p>
                                    Hosted by <strong>{activity.host?.username}</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.hosting ? (
                    <Button  color='orange' floated='right'>
                        Manage Event
                    </Button>
                ) : activity.going ? (
                    <Button onClick={activityStore.changeAttendance} >Cancel attendance</Button>
                ) : (
                    <Button onClick={activityStore.changeAttendance} color='teal'>Join Activity</Button>
                )}
            </Segment>
        </Segment.Group>
    )
})