import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import { Message } from "../models/message";

class MessageStore {
    messages: Message[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);  
    }

   
    startConnection = (activityId: string, token: string) => {
        if (this.hubConnection) {
            return;
        }
        console.log(activityId);
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('https://newactivityproject-production-47a4.up.railway.app/chat?activityId=' + activityId, {
            accessTokenFactory: () => token
        })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
            
        this.hubConnection
            .start()
            .catch(err => console.log('Error while establishing connection :(', err));

        this.hubConnection.on('ReceiveMessage', this.receiveMessage);
        this.hubConnection.on('ReceiveInitialMessages', this.receiveInitialMessages);
    }

    
    sendMessage = async (command: any) => {
        if (!this.hubConnection) {
            return;
        }

        try {
            await this.hubConnection.invoke('SendMessage', command);
        } catch (err) {
            console.log('Error while sending message: ', err);
        }
    }

    
    receiveMessage = (message: Message) => {
        this.messages.push(message);
    }

  
    receiveInitialMessages = (messages: Message[]) => {
        this.messages = [...this.messages, ...messages];
        console.log("MESSAGES: " + this.messages.map(message => message.messageBody).join(', '));
    }

  
    stopConnection = () => {
        if (!this.hubConnection) {
            return;
        }

        this.hubConnection.stop()
            .catch(err => console.log('Error while stopping connection :(', err));

        this.hubConnection = null;
        this.messages = [];
    }
}

export default MessageStore;