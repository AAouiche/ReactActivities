import React from 'react'
import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Attendee } from '../../../app/models/attendee';

interface Props{
    attendee:Attendee[];
}

export default observer(function ActivityDetailedSidebar ({attendee}:Props) {
    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendee.length} {attendee.length === 1?'person':'People'} going
            </Segment>
            <Segment attached>
            <List relaxed divided>
    {attendee.map(attendee =>(
        <Item key ={attendee.username} style={{ position: 'relative' }}>
            {attendee.isHost && (
                <Label
                    style={{ position: 'absolute' }}
                    color='orange'
                    ribbon='right'
                >
                    Host
                </Label>
            )}
            <Image
    size='tiny'
    src={attendee.imageUrl || '/assets/user.png'}
    style={{ width: '50px', height: '50px', objectFit: 'cover' }}  
/>
            <Item.Content verticalAlign='middle'>
                <Item.Header key={attendee.username} as='h3'>
                    <Link to={`#`}>{attendee.username}</Link>
                </Item.Header>
                
            </Item.Content>
        </Item>
    ))}
</List>
            </Segment>
        </>

    )
})