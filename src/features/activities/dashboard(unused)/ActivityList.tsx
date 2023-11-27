import React, { Fragment, useEffect } from "react";
import { Button, Header, Item, Label, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/Stores/rootStore";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ListItem from "./ListItem";

function ActivityList() {
    const { activityStore } = useStore();
    const { groupActivitiesByDate, currentPage, totalCount, pageSize, setCurrentPage } = activityStore;

    const totalPages = Math.ceil(totalCount / pageSize);

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
    function handleDelete(id:string){
        try{
            activityStore.deleteActivity(id);
        }catch(error){
            console.error("Error:", error);
        }
       
    };

    return (
        <>
            {groupActivitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header color='blue'>{group}</Header>
                    {activities.map(activity => (
                        <ListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
                
            ))}
            <Button>
                fgsdgh
            </Button>
            hfghgfhdf

           
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