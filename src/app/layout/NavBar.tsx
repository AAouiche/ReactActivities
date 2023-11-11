import React  from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Menu, Image} from "semantic-ui-react";
import { useStore } from "../Stores/rootStore";
import { observer } from "mobx-react-lite";
import {  useNavigate, useParams } from 'react-router-dom';



 function NavBar(){
    const { userStore} = useStore();
    const navigate = useNavigate();
    
    function handleLogout() {
        userStore.logout();
        navigate('/'); // Navigate to the home page
    }
    console.log('NavBar Rendering:', userStore.user);
    return(
        <Menu inverted fixed = 'top' >
            <Container>
                <Menu.Item  header>
                    <img src = "/assets/logo.png" alt="logo"/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name = 'Activities' />
             
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content = 'Create Activity' />
                </Menu.Item>
                {userStore.isLoggedIn && (
                <Menu.Item position='right'>
                     <Image avatar spaced='right' src={userStore.user?.imageUrl || '/assets/user.png'} />
                    <Dropdown pointing='top left' text={userStore.user?.userName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to='/profile' name = 'Profile' text='Profile' icon='user' />
                            <Dropdown.Item text='Settings' icon='settings' />
                            <Dropdown.Item text='Logout' icon='power' onClick={handleLogout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            )}
            </Container>

        </Menu>
    )
}

export default observer(NavBar);