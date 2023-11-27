import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/Stores/rootStore';
import { formatDistanceToNow } from 'date-fns';


 
interface Props {
    activity: Activity
}
export default observer(function ActivityDetailedChat({activity}: Props) {
    const { messageStore, userStore } = useStore();
    const [messageContent, setMessageContent] = useState(''); 

    useEffect(() => {
        if (activity.id && userStore.token) {
            messageStore.startConnection(activity.id, userStore.token);
            console.log(userStore.token);
        }

        return () => {
            messageStore.stopConnection();
        };
    }, [activity.id, userStore.token, messageStore]);

    const handleFormSubmit = () => {
        if (messageContent) {
            const command = {
                activityId: activity.id,
                messageBody: messageContent
                
            };
            messageStore.sendMessage(command);
            setMessageContent(''); 
        }
    };

    return (
        <>
            <Segment textAlign='center' attached='top' inverted color='teal' style={{border: 'none'}}>
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                {messageStore.messages.map(message => (
        <Comment className="custom-comment" key={message.id} style={{ display: 'flex', flexDirection: message.displayName === userStore.user?.displayName ? 'row-reverse' : 'row' }}>
            <Comment.Avatar 
             src={message.image || '/assets/user.png'} 
             style={{
             marginRight: message.displayName === userStore.user?.displayName ? '0' : '-30px', 
             marginLeft: message.displayName === userStore.user?.displayName ? '20px' : '0'
            }} 
                 />
            <Comment.Content style={{ maxWidth: '80%', overflowWrap: 'break-word' }}>
                <Comment.Author style={{ color: 'white' }} as='a'>{message.displayName}</Comment.Author>
                <Comment.Metadata style={{ color: 'white' }}>
                  <div>{formatDistanceToNow(new Date(message.created))} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ color: 'white' }}>{message.messageBody}</Comment.Text>
                
            </Comment.Content>
            </Comment>
                ))}
                    <Form reply onSubmit={handleFormSubmit}>
                        <Form.TextArea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
                        <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            </Segment>
        </>
    );
});