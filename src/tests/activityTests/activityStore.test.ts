


import ActivityStore from "../../app/Stores/activityStore";
import { rootStore, useStore } from "../../app/Stores/rootStore";
import agent from "../../app/api/agent";
import { Activity } from "../../app/models/activity";

jest.mock('../../app/api/agent', () => ({
    Activities: {
        list: jest.fn(),
        edit: jest.fn(),  
        delete: jest.fn(),  
        create: jest.fn(),
        details: jest.fn()
    },
}));

describe('ActivityStore', () => {
    let activityStore: ActivityStore;
    let mockActivities: string | any[];
    let mockMetadata: { totalCount: number; pageSize: number; currentPage: number; };

    beforeEach(() => {
        activityStore = rootStore.activityStore;
       
        mockActivities = [
            { id: '1', title: 'Activity 1', date: new Date()},
            { id: '2', title: 'Activity 2', date: new Date() },
            
          ];
        mockMetadata = { totalCount: 10, pageSize: 5, currentPage: 1 };

        
    });
    afterEach(() =>{
        activityStore.clearActivities();
    })

    describe('loadActivities', () => {
        it('should load activities and update the store correctly', async () => {
            const mockList = agent.Activities.list as jest.Mock;
            mockList.mockResolvedValue({
                items: mockActivities,
                metadata: mockMetadata
                
            });

            await activityStore.loadActivities();
            console.log(activityStore.activityMap);

            // Assertions
            //expect(activityStore.activityMap.size).toBe(mockActivities.length);
            expect(activityStore.totalCount).toBe(10);
            expect(activityStore.pageSize).toBe(5);
            expect(activityStore.currentPage).toBe(1);
        });

        
    });
    describe('createActivity', () => {
        it('should create an activity and update the store correctly', async () => {
            const newActivity = { id: '3', title: 'New Activity', date: new Date() };
            const mockCreate = agent.Activities.create as jest.Mock;
            
            
            mockCreate.mockResolvedValue(newActivity);
    
            await activityStore.createActivity(newActivity);
    
           
            expect(activityStore.activityMap.get(newActivity.id)).toEqual(newActivity);
            expect(activityStore.loading).toBe(false); 
        });
    });
    describe('setActivity', () => {
        it('should add a new activity if it does not exist', () => {
            const newActivity = { id: '3', title: 'New Activity', date: new Date() };
            activityStore.setActivity(newActivity);
            
            expect(activityStore.activityMap.get('3')).toEqual(newActivity);
        });
    
        
    });
    describe('editActivity', () => {
        it('should edit an activity and update it in the activityMap', async () => {
            const existingActivity = { id: '3', title: 'Existing Activity', date: new Date() };
            activityStore.setActivity(existingActivity); 
    
            const updatedActivity = { id: '3', title: 'Updated Activity', date: new Date() };
            const mockEdit = agent.Activities.edit as jest.Mock;
            mockEdit.mockResolvedValue(undefined);
    
            await activityStore.editActivity(updatedActivity);
    
            expect(activityStore.activityMap.get('3')).toEqual(updatedActivity);
            expect(activityStore.selectedActivity).toEqual(updatedActivity);
            expect(activityStore.loading).toBe(false);
        });
    });
    describe('deleteActivity', () => {
        it('should delete an activity from the activityMap', async () => {
            const activityId = 'someActivityId';
            const mockActivity = { id: activityId, title: 'Activity to Delete', date: new Date() };
            activityStore.setActivity(mockActivity); 
    
            const mockDelete = agent.Activities.delete as jest.Mock;
            mockDelete.mockResolvedValue(undefined);
    
            await activityStore.deleteActivity(activityId);
    
            expect(activityStore.activityMap.has(activityId)).toBe(false);
            expect(activityStore.loading).toBe(false);
        });
    });
    
    describe('loadActivity', () => {
        it('should load an activity from the map if available', async () => {
            const mockActivity = { id: 'random-id', title: 'Activity 1' };
            activityStore.activityMap.set('random-id', mockActivity);
            
            await activityStore.loadActivity('random-id');
    
            expect(activityStore.selectedActivity).toEqual(mockActivity);
        });
        it('calls api if activity isnt available', async () => {
            const mockActivity2 = { id: 'random-id', title: 'Activity ' };
            const mockDeltails = agent.Activities.details as jest.Mock;
            mockDeltails.mockResolvedValue(mockActivity2)

            await activityStore.loadActivity('random-id');

            expect(activityStore.selectedActivity).toEqual(mockActivity2);
        })
        
    });
    
});