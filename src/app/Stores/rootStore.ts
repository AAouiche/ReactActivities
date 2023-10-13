import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";

interface Store{
    activityStore: ActivityStore
    userStore: UserStore
}

export const rootStore: Store = {
     activityStore: new ActivityStore(),
     userStore: new UserStore()
}

export const StoreContext = createContext(rootStore)

export function useStore(){
    return useContext(StoreContext)
}