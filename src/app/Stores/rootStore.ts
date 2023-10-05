import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store{
    activityStore: ActivityStore
}

export const rootStore: Store = {
     activityStore: new ActivityStore()
}

export const StoreContext = createContext(rootStore)

export function useStore(){
    return useContext(StoreContext)
}