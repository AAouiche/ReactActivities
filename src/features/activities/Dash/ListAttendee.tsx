import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { Attendee } from "../../../app/models/attendee";
import { useStore } from "../../../app/Stores/rootStore";
import { Link } from "react-router-dom";
import AttendeePopup from "./PopUp";

interface Props{
    attendee:Attendee[];
}




 
function ListAttendee({attendee}:Props){
    const { activityStore } = useStore();

   
return(
    <List horizontal>
            {attendee.map(att => (
                <List.Item key={att.username} as={Link} to={`/attendee/${att.username}`}>
                    <Popup
                        content={<AttendeePopup attendee={att} />}
                        trigger={
                            <Image size='mini' circular src={att.imageUrl || '/assets/user.png' }/>
                        }
                        position='top center'
                        on='hover'
                    />
                </List.Item>
            ))}
        </List>
)
}
export default observer(ListAttendee);