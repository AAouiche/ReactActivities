import React from 'react'
import Calendar from 'react-calendar'
import { Header, Menu } from 'semantic-ui-react'

export default function Filter(){
    return(
        <>
        <Menu vertical size='large' style={{width: '100%'}}>
            <Header icon='filter' attached color = 'blue' content='Filter'/>
            <Menu.Item content='All'/>
            <Menu.Item content='Going'/>
            <Menu.Item content='Hosting'/>
        </Menu>
        <Header/>
        <Calendar/>
        </>
    )
        
        
}