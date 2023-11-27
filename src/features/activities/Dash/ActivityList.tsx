import React, { Fragment, useEffect } from "react";
import { Button, Header, Icon, Item, Label, Message, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/Stores/rootStore";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ListItem from "./ListItem";

function ActivityList() {
    const { activityStore } = useStore();
    const { activityByDate, currentPage, totalPages, setCurrentPage } = activityStore;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (activityByDate.length === 0) {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name='search' />
                    No activities found.
                </Header>
            </Segment>
        );
    }

    return (
        <>
             <Message info>
                <Message.Header>Public Activities</Message.Header>
                <p>All activities listed here are public and visible to all users.</p>
            </Message>
            {activityByDate.map(activity => (
                <ListItem key={activity.id} activity={activity} />
            ))}
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button onClick={handlePreviousPage} disabled={currentPage <= 1}>
                    Previous
                </Button>
                <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={currentPage >= totalPages}>
                    Next
                </Button>
            </div>
        </>
    );
}



export default observer(ActivityList);