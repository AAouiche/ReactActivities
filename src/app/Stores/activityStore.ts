import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import moment from "moment";

class ActivityStore {
    activities: Activity[] = [];
    activityMap = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading: boolean = true;
    loadingInitial: boolean = false;
   

    constructor() {
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        
        try {
            const activities = await agent.Activities.list();
            
             runInAction(() => {
                this.setLoading(false);
                 activities.forEach(activity => {
                  activity.date = this.formatDate(activity.date);
                   this.setActivity(activity);
                });
            });
            console.log(activities);
            console.log(this.activityMap);

        } catch (error) {
            console.error("Failed to load activities", error);
        } finally {
            runInAction(() =>{
                this.setLoading(false);
            })
            
        }
    };

    createActivity = async (activity: Activity) => {
        this.loading = true;
    
        // Create a manual activity
        const manualActivity: Activity = {
            
            title: "Sampleivity",
            description: "This iample description.",
            category: "Sampory",
            date: new Date().toISOString(),
            city: "Sampty",
            venue: "Sampenue"
        };
    
        try {
            // Use manual activity instead of the passed one
            await agent.Activities.create(activity);
            runInAction(() => {
                this.setActivity(manualActivity);
            });
        } catch (error) {
            console.error("Failed to create activity", error);
        } finally {
            this.loading = false;
        }
    };

    editActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.edit(activity);
            runInAction(() => {
                this.setActivity(activity);
                this.selectedActivity = activity;
                
            });
        } catch (error) {
            console.error("Failed to edit activity", error);
        } finally {
            this.loading = false;
        }
    };

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityMap.delete(id);
            });
        } catch (error) {
            console.error("Failed to delete activity", error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
            
        }
    };

    loadActivity = async (id: string) => {
        
        let activity = this.getActivity(id);
        if (activity) {
            
            runInAction(() => {
                this.selectedActivity = activity;
            });
            
            
        } else {
            try {
                this.loading = true;
                activity = await agent.Activities.details(id);
                
                    this.setActivity(activity);
                    this.selectedActivity = activity;
                
                return activity;
            } catch (error) {
                console.error("Failed to load activity details", error);
            } finally {
                this.loading = false;
            }
        }
    };

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setSelectedActivity = (activity: Activity) => {
        this.selectedActivity = activity;
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    getActivity = (id:string):Activity | undefined =>{
        return this.activityMap.get(id);
    }
    setActivity = (activity: Activity) => {
        if (activity && activity.id != null) {
            this.activityMap.set(activity.id, activity);
        } else {
            console.error("Activity or Activity ID is undefined:", activity);
            // Handle error as per your use case
        }
    };
    formatDate = (date:string) =>{
       return moment(date).format('YYYY-MM-DD');
    }
    get activityByDate(){
        return Array.from(this.activityMap.values()).sort((a,b) =>
          Date.parse(a.date) - Date.parse(b.date));
    }
    get groupActivitiesByDate() {
        return Object.entries(
            this.activityByDate.reduce((activities, activity) => {
                const dateKey = this.formatDate(activity.date);
                activities[dateKey] = activities[dateKey] ? [...activities[dateKey], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }
}

export default ActivityStore;