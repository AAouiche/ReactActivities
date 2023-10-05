import React from "react";
import { Grid, List } from "semantic-ui-react";

import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import Filter from "./Filter";


export default function ActivityDash() {
    return(
        <Grid className='Dash'>
          <Grid.Column width = '10'>
             <ActivityList />
          </Grid.Column>
          <Grid.Column width = '6'>
             <Filter/>
             
          </Grid.Column>
        </Grid>
        
    )
}