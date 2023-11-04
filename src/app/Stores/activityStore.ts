import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import moment from "moment";
import { Store, rootStore, useStore } from "./rootStore";
import UserStore from "./userStore";
import { Root } from "react-dom/client";

class ActivityStore {
    activities: Activity[] = [];
    activityMap = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading: boolean = false;
    loadingInitial: boolean = false;
    errors: string[] = [];
    currentFilter: "all" | "going" | "hosting" = "all";
    selectedDate: Date | null = null; 
    
   

   

    constructor() {
        makeAutoObservable(this);
        
    }
    

    loadActivities = async () => {
        
        try {
            this.loading = true;
            const activities = await agent.Activities.list();
            console.log(activities);      
             runInAction(() => {
                this.loading = false;
                 activities.forEach(activity => {
                  
                   this.setActivity(activity);
                });
            });
            console.log("loadactivities");
            console.log(this.activityMap);

        } catch (error) {
            console.error("Failed to load activities", error);
        } finally {
            runInAction(() =>{
                this.loading = false;
            })
            
        }
    };

    createActivity = async (activity: Activity) => {
        this.loading = true;


        
        try {
            // Use manual activity instead of the passed one
            console.log('Sending activity to API:', activity );
            //console.log('Sending manual activity to API:', manualActivity );
            const createdActivity = await agent.Activities.create(activity);
            console.log('Sent activity to API:', activity );
            runInAction(() => {
                this.setActivity(createdActivity);
            });
            
            console.log(createdActivity);
            return createdActivity
        } catch (error) {
            console.error("activity", error);
            this.setErrors(["gfjhdghdf"]);
            console.log(this.errors);
            throw error;
        } finally {
            runInAction(() => {
            this.loading = false;
            });
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
    clearActivities = () =>{
      runInAction(() =>{
        this.activityMap.clear();
        this.loading = false;
      })
    }

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
                runInAction(() => {
                this.loading = false;
                });
            }
        }
    };
    changeAttendance = async() => {
        const user = rootStore.userStore.user;
        if (!user) {
            console.error("User not authenticated");
            return;
        }
    
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id!);
            runInAction(() => {
                if (this.selectedActivity) {
                    // Toggle attendance status
                    const attendee = this.selectedActivity.attendees?.find(a => a.username === user.userName);
                    if (attendee) {
                        // User is already attending, so remove them
                        this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user.userName);
                        this.selectedActivity.going = false;
                    } else {
                        // User is not attending, so add them
                        if (!this.selectedActivity.attendees) {
                            this.selectedActivity.attendees = [];
                        }
                        this.selectedActivity.attendees.push({
                            username: user.userName,
                            displayName: user.displayName
                           
                        });
                        this.selectedActivity.going = true;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
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
        const user = rootStore.userStore.user;
        if(user) {
            
            for(let i = 0; i < activity.attendees!.length; i++) {
                if(activity.attendees![i].username === user.userName) {
                    activity.going = true;
                    break;  // Exit the loop once a match is found
                }
            }
            activity.hosting = activity.host?.username === user.userName;
            
        }
        if (activity && activity.id != null) {
            activity.date = new Date(activity.date!);
            this.activityMap.set(activity.id, activity);
        } else {
            console.error("Activity or Activity ID is undefined:", activity);
            // Handle error as per your use case
        }
    };
    formatDate = (date:Date) =>{
       return moment(date).format('YYYY-MM-DD');
    }
    setErrors = (errors: string[]) => {
        this.errors = errors;
    };
    get activityByDate(){
        return Array.from(this.activityMap.values()).sort((a,b) =>
        a.date!.getTime() - b.date!.getTime());
    }
    get groupActivitiesByDate() {
        return Object.entries(
            this.filteredActivities.reduce((activities, activity) => {
                const dateKey = this.formatDate(activity.date!);
                activities[dateKey] = activities[dateKey] ? [...activities[dateKey], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }
    setFilter = (filter: "all" | "going" | "hosting") => {
        this.currentFilter = filter;
        console.log(this.currentFilter)
    }
    get filteredActivities(): Activity[] {
        const activitiesArray = Array.from(this.activityMap.values());
        
        let filteredByType: Activity[] = [];
    
        switch (this.currentFilter) {
            case "going":
                filteredByType = activitiesArray.filter(activity => activity.going && !activity.hosting);
                break;
            case "hosting":
                filteredByType = activitiesArray.filter(activity => activity.hosting);
                break;
            default:
                filteredByType = activitiesArray;
                break;
        }
    
        
        if (this.selectedDate) {
            return filteredByType.filter(activity => activity.date && activity.date.toISOString().split('T')[0] === this.selectedDate!.toISOString().split('T')[0]);
        }
    
        return filteredByType;
    }
    isFilterActive(filter: "all" | "going" | "hosting"): boolean {
        return this.currentFilter === filter;
    }
    clearSelectedDate() {
        this.selectedDate = null;
    }
}

export default ActivityStore;