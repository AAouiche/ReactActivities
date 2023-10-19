import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";

export interface Store{
    activityStore: ActivityStore
    userStore: UserStore
}

export const rootStore: Store = {
    userStore: new UserStore(),
    activityStore: new ActivityStore()
     
}

export const StoreContext = createContext(rootStore)

export function useStore(){
    return useContext(StoreContext)
}