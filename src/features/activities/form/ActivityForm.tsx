import React, { useState, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { useStore } from "../../../app/Stores/rootStore";
import { Activity } from "../../../app/models/activity";
import {  useNavigate, useParams } from 'react-router-dom';


export default function ActivityForm() {
  
  const { activityStore } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();

 
  const [activity, setActivity] = useState<Activity>({
    id: undefined,
    title: "",
    description: "",
    date: "",
    category: "",
    city: "",
    venue: "",
  });

  // Use useEffect to populate form fields when editing
  useEffect(() => {
    if ( id) {
      
      const activityToEdit = activityStore.getActivity(id);
      if(activityToEdit){
        setActivity(activityToEdit);
      }else{
        setError('The activity you are trying to edit cannot be found.');
      }
      
    }
  }, [ id, activityStore]);

  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
};

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement| HTMLTextAreaElement>) => {
    e.preventDefault(); 
      if(!activity.id){
        activityStore.createActivity(activity).then(() =>navigate(`/activity/${activity.id}`));
      }else{
        activityStore.editActivity(activity).then(() =>navigate(`/activity/${activity.id}`));
      }
    
    
  };

  return (
    <>
    {id! ? (
      <>
        <p>test</p>
      </>
    ) : null}
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name="title"
          value={activity.title}
          onChange={handleInputChange}
          placeholder="Title"
          label="Title"
        />
        <Form.TextArea
          name="description"
          value={activity.description}
          onChange={handleInputChange}
          placeholder="Description"
          label="Description"
        />
        <Form.Input
          name="date"
          type="date"
          value={activity.date}
          onChange={handleInputChange}
          placeholder="Date"
          label="Date"
        />
        <Form.Input
          name="city"
          value={activity.city}
          onChange={handleInputChange}
          placeholder="City"
          label="City"
        />
        <Form.Input
          name="category"
          value={activity.category}
          onChange={handleInputChange}
          placeholder="Category"
          label="Category"
        />
        <Form.Input
          name="venue"
          value={activity.venue}
          onChange={handleInputChange}
          placeholder="Venue"
          label="Venue"
        />
        <Button primary type="submit" content="Submit" />
        <Button primary type="button" content="Cancel" />
      </Form>
    </Segment>
    </>
  );
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
