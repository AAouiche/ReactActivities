import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { List, Image } from "semantic-ui-react";
import { Attendee } from "../../../app/models/attendee";
import { useStore } from "../../../app/Stores/rootStore";
import { Link } from "react-router-dom";

interface Props{
    attendee:Attendee[];
}




 
function ListAttendee({attendee}:Props){
    const { activityStore } = useStore();

    useEffect(() => {
        
    }, []); 
return(
    <List horizontal>
        {attendee.map(attendee=>(
            <List.Item key={attendee.username} as={Link} to={`/attendee/${attendee.username}`}>
            <Image size='mini' circular src='/assets/user.png'/>
        </List.Item>
        ))}
        
       
    </List>
)
}
export default observer(ListAttendee);