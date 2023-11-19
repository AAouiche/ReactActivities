import { createContext, useContext } from "react";
import {ActivityStore} from "./activityStore";
import UserStore from "./userStore";

import MessageStore from "./messageStore";

export interface Store{
    activityStore: ActivityStore
    userStore: UserStore
    messageStore: MessageStore
}

export const rootStore: Store = {
    userStore: new UserStore(),
    activityStore: new ActivityStore(),
    messageStore: new MessageStore()
     
}

export const StoreContext = createContext(rootStore)

export function useStore(){
    return useContext(StoreContext)
}