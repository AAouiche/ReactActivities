


import { useStore } from "../../app/Stores/rootStore";
import agent from "../../app/api/agent";
import { Activity } from "../../app/models/activity";

jest.mock('../../app/api/agent'); 

describe('ActivityStore', () => {
    
    let mockActivity: Activity;
    const { activityStore } = useStore();
    

    beforeEach(() => {

        jest.spyOn(localStorage, 'getItem').mockImplementation(() => null);
        jest.spyOn(localStorage, 'setItem').mockImplementation(() => {});
        jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {});
        jest.spyOn(localStorage, 'clear').mockImplementation(() => {});
        //store = new ActivityStore();
        mockActivity = {
            id: '1',
            title: 'Test Activity',
            
        };
    });
    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it('should load activities', async () => {
        agent.Activities.list = jest.fn().mockResolvedValue({
            items: [mockActivity],
            metadata: { totalCount: 1, pageSize: 5, currentPage: 1 },
        });
        await activityStore.loadActivities();
        expect(activityStore.activityMap.size).toBe(1);
        expect(activityStore.totalCount).toBe(1);
        
    });

    it('should create an activity', async () => {
        agent.Activities.create = jest.fn().mockResolvedValue(mockActivity);
        await activityStore.createActivity(mockActivity);
        expect(activityStore.activityMap.get(mockActivity.id!)).toEqual(mockActivity);
        
    });

    
});