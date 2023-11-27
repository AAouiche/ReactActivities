import MessageStore from "../../app/Stores/messageStore";
import { rootStore } from "../../app/Stores/rootStore";
import { Message } from "../../app/models/message";


describe('MessageStore', () => {
    let messageStore: MessageStore;
    let mockHubConnection:any ;

    beforeEach(() => {
        messageStore = rootStore.messageStore;
        mockHubConnection = {
            start: jest.fn().mockResolvedValue(null),
            on: jest.fn(),
            stop: jest.fn().mockResolvedValue(null),
            invoke: jest.fn().mockResolvedValue(null)
        };

        
    });

    
    describe('sendMessage', () => {
        it('should send a message via the hub connection', async () => {
           
            const command = {
                activityId: 'mockActivityId', 
                messageBody: 'Mock message content' 
            };
            messageStore.hubConnection = mockHubConnection;
    
            await messageStore.sendMessage(command);
    
            expect(mockHubConnection.invoke).toHaveBeenCalledWith('SendMessage', command);
        });
    });
describe('receiveMessage', () => {
    it('should add a new message to the messages array', () => {
        const newMessage: Message = {
            id: 1, 
            messageBody: 'Hello, this is a test message!',
            created: new Date(),
            userName: 'user123',
            image: 'path/to/image.jpg', 
            displayName: 'John Doe' 
        };
        messageStore.receiveMessage(newMessage);

        expect(messageStore.messages).toContainEqual(newMessage);
    });
});
const newMessage: Message = {
    id: 1, 
    messageBody: 'Hello, this is a test message!',
    created: new Date(),
    userName: 'user123',
    image: 'path/to/image.jpg', 
    displayName: 'John Doe' 
};

        describe('receiveInitialMessages', () => {
            it('should add initial messages to the messages array', () => {
                const initialMessages = [{ id: 1, 
                    messageBody: 'Hello, this is a test message!',
                    created: new Date(),
                    userName: 'user123',
                    image: 'path/to/image.jpg', 
                    displayName: 'John Doe' }, { id: 2, 
                        messageBody: 'Hello, this is a test message!',
                        created: new Date(),
                        userName: 'user1234',
                        image: 'path/to/image.jpg', 
                        displayName: 'John Does' }];
                messageStore.messages = []; 
                messageStore.receiveInitialMessages(initialMessages);
        
                expect(messageStore.messages.length).toBe(initialMessages.length);
            });
        });
        describe('stopConnection', () => {
          it('should stop the hub connection and clear messages', () => {
            messageStore.hubConnection = mockHubConnection;
            messageStore.stopConnection();

            expect(mockHubConnection.stop).toHaveBeenCalled();
            expect(messageStore.messages).toEqual([]);
         }); 
        });
});