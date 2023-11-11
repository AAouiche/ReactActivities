import React from 'react';
import { Attendee } from '../../../app/models/attendee';

interface Props {
    attendee: Attendee;
}

function AttendeePopup ({ attendee }:Props)  {
    return (
        <div>
            
            <h4>{attendee.displayName}</h4>
            <p>Username: {attendee.username}</p>
            {attendee.bio && <p>Bio: {attendee.bio}</p>}
            {attendee.isHost && <p>Host of the activity</p>}
        </div>
    );
}

export default AttendeePopup;