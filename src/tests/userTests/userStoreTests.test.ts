import { rootStore } from "../../app/Stores/rootStore";
import UserStore from "../../app/Stores/userStore";
import agent from "../../app/api/agent";

jest.mock('../../app/api/agent', () => ({
    Account: {
        login: jest.fn(),
        register: jest.fn(),
        edit: jest.fn(),
        validateToken: jest.fn(),
        LoggedIn: jest.fn(),
    },
    Image: {
        upload: jest.fn(),
    },
}));

jest.mock('axios');

describe('UserStore', () => {
    let userStore:UserStore;

    beforeEach(() => {
        userStore = rootStore.userStore;
        localStorage.clear();
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        userStore.logout();
    });

    

    describe('login', () => {
        it('should set the user and token on successful login', async () => {
            const mockUser = { userName: 'testUser', token: 'testToken' };
            const mockLogin = agent.Account.login as jest.Mock;
            mockLogin.mockResolvedValue(mockUser);
    
            await userStore.login({ username: 'testUser', password: 'password',email:'test@email.com' });
    
            expect(userStore.user).toEqual(mockUser);
            expect(userStore.isLoggedIn).toBe(true);
            
            expect(localStorage.getItem('userToken')).toBe(mockUser.token);
        });
    
        
    });

    describe('register', () => {
        it('should call the register API with submission data', async () => {
            const submission = { username: 'newUser', password: 'password', email: 'new@example.com' };
            const mockRegister = agent.Account.register as jest.Mock;
            mockRegister.mockResolvedValue({});
    
            await userStore.register(submission);
    
            expect(mockRegister).toHaveBeenCalledWith(submission);
        });
    
        
    });

    describe('editUser', () => {
        it('should update user details and set loading correctly', async () => {
            
            userStore.user = {
                userName: 'testUser',
                imageUrl: '',  
                displayName: 'Test User',
                token: 'testToken',
                email: 'test@example.com',
                
            };
    
            const submission = { displayName: 'New Name', email: 'new@example.com' };
            const editedUser = { ...userStore.user, ...submission };
            const mockEdit = agent.Account.edit as jest.Mock;
            mockEdit.mockResolvedValue(editedUser);
    
            await userStore.editUser(submission);
    
            expect(userStore.user!.displayName).toBe(submission.displayName);
            expect(userStore.user!.email).toBe(submission.email);
            expect(userStore.loading).toBe(false);
        });
    
        
    });

    describe('logout', () => {
        it('should clear user data and tokens', () => {
            userStore.logout();
            expect(userStore.user).toBeNull();
            expect(userStore.isLoggedIn).toBe(false);
            expect(localStorage.getItem('userToken')).toBeNull();
        });
    });

    describe('uploadProfileImage', () => {
        it('should upload the image using FormData', async () => {
            const mockImageFile = new Blob(['image data'], { type: 'image/png' });
            const mockResponse = { url: 'http://example.com/image.png' };
            const mockUpload = agent.Image.upload as jest.Mock;
            mockUpload.mockResolvedValue(mockResponse);
    
            
            const appendSpy = jest.spyOn(FormData.prototype, 'append');
    
            await userStore.uploadProfileImage(mockImageFile);
    
            
            expect(appendSpy).toHaveBeenCalledWith('imageFile', mockImageFile);
    
            
            expect(mockUpload).toHaveBeenCalledWith(expect.any(FormData));
    
            
            appendSpy.mockRestore();
        });
    
        
    });

    
});