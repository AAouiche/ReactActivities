import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import moment from "moment";
import {  rootStore } from "./rootStore";


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
    
   
     // Pagination properties
     totalCount = 0;
     pageSize = 5;
     currentPage = 1;
   

    constructor() {
        makeAutoObservable(this);
        
    }
    

    loadActivities = async () => {
        try {
            this.loading = true;
            const response = await agent.Activities.list(this.currentPage, this.pageSize);
            const { items, metadata } = response;
            
            runInAction(() => {
                this.activityMap.clear(); 
                items.forEach((activity: Activity) => {
                    this.setActivity(activity);
                });
                this.totalCount = metadata.totalCount;
                this.pageSize = metadata.pageSize;
                this.currentPage = metadata.currentPage;
                this.loading = false;
            });
        } catch (error) {
            console.error("Failed to load activities", error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };
   setCurrentPage = (page: number) => {
    this.currentPage = page;
    this.loadActivities(); 
};

    createActivity = async (activity: Activity) => {
        this.loading = true;


        
        try {
            
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
                    
                    const attendee = this.selectedActivity.attendees?.find(a => a.username === user.userName);
                    if (attendee) {
                        
                        this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user.userName);
                        this.selectedActivity.going = false;
                    } else {
                        
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
        var activity = this.activityMap.get(id);
        console.log("retrieved activity", activity);
        return activity;
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