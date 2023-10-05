import React from "react";
import { Grid, List } from "semantic-ui-react";

import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";


export default function ActivityDash() {
    return(
        <Grid>
          <Grid.Column width = '10'>
             <ActivityList />
          </Grid.Column>
          <Grid.Column width = '6'>
             
             
          </Grid.Column>
        </Grid>
        
    )
}