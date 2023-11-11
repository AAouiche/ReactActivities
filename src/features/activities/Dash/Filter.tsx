import React, { useState } from 'react'
import Calendar from 'react-calendar'
import { Button, Header, Menu } from 'semantic-ui-react'
import { useStore } from '../../../app/Stores/rootStore';
import { observer } from 'mobx-react-lite';

 function Filter() {
    const { activityStore } = useStore();

    
    const [currentFilter, setCurrentFilter] = useState(activityStore.currentFilter);

    
    const handleFilterClick = (filter:any) => {
        activityStore.setFilter(filter);
        setCurrentFilter(filter);  
    };

    const handleDateChange = (value: any, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        activityStore.selectedDate = value;
    };

    return (
        <>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='blue' content='Filter' />
                
                <Menu.Item 
                    content='All'
                    active={currentFilter === 'all'}
                    onClick={() => handleFilterClick('all')}
                />
                <Menu.Item 
                    content='Going'
                    active={currentFilter === 'going'}
                    onClick={() => handleFilterClick('going')}
                />
                <Menu.Item 
                    content='Hosting'
                    active={currentFilter === 'hosting'}
                    onClick={() => handleFilterClick('hosting')}
                />
            </Menu>

            <Header />
            <Calendar 
                onChange={handleDateChange}
                value={activityStore.selectedDate}
            />
             {activityStore.selectedDate && (
                <Button onClick={() => activityStore.clearSelectedDate()}>
                    Clear Date Filter
                </Button>
            )}
        </>
    );
}
export default observer(Filter);