import { Link, NavLink } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/Stores/rootStore";
import { format } from "date-fns";
import ListAttendee from "./ListAttendee";


interface Props{
    activity:Activity
}






export default function ListItem({activity}: Props){
    const { activityStore } = useStore();


    function handleDelete(event: React.MouseEvent<HTMLButtonElement>, id: string) {
        event.preventDefault();  // Using event here
    
        // Confirm deletion
        const isConfirmed = window.confirm("Are you sure you want to delete this activity?");
    
        if (!isConfirmed) {
            return; // Exit function if user selects "Cancel" in the confirmation dialog
        }
    
        try {
            activityStore.deleteActivity(id);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return(
         <Segment.Group>
            <Segment>
                <Item.Group>
                   <Item.Image size='tiny' circular src={activity.host?.imageUrl || '/assets/user.png'}/>
                   <Item.Content>
    <Item.Header as={Link} to={`/activity/${activity.id}`}>
        {activity.title}
    </Item.Header>
    <Item.Description>Hosted by {activity.host!.username}</Item.Description>

    {/* Conditionally render labels based on user role */}
    {activity.hosting ? (
        <Label color="blue">Hosting</Label>
    ) : activity.going ? (
        <Label color="green">Attending</Label>
    ) : null}
</Item.Content>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                <Icon name='clock' /> {format(activity.date!, 'yyyy-MM-dd HH:mm')}
                    <Icon name= 'marker'/> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ListAttendee  attendee={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                as = {Link}
                to = {`/activity/${activity.id}`}
                color='blue'
                floated='right'
                content='view'
                />
                <Button
                onClick={(e) => handleDelete(e, activity.id!)}
                color='blue'
                floated='right'
                content='delete'
                />
            </Segment>
         </Segment.Group>

/* <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button 
                                    as={NavLink} 
                                    to={`/activity/${activity.id}`} 
                                    floated='right' 
                                    content='View' 
                                    color='red' 
                                />
                                <Button 
                                    onClick={(event) => handleDelete(event,activity.id!)}  
                                    floated='right' 
                                    content='Delete' 
                                    color='red' 
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item> */

    )
}