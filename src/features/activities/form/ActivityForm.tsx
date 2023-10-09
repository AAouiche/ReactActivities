import React, { useState, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { useStore } from "../../../app/Stores/rootStore";
import { Activity } from "../../../app/models/activity";
import {  useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from "../../../app/Errors/ErrorMessage";
import { Formik } from "formik";


export default function ActivityForm() {
  
  const { activityStore } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentDate = new Date().toISOString().split("T")[0];
  const [errors, setErrors] = useState<string[] | null>(null);
 
  const [activity, setActivity] = useState<Activity>({
    id: undefined,
    title: "",
    description: "",
    date: currentDate,
    category: "",
    city: "",
    venue: "",
  });

  // Use useEffect to populate form fields when editing
  useEffect(() => {
    if (id) {
      const activityToEdit = activityStore.getActivity(id);
      if (activityToEdit) {
        setActivity(activityToEdit);
      } else {
        setErrors(['The activity you are trying to edit cannot be found.']);
      }
    }
    //setErrors( ["An unexpected error occurred."]);
    console.log("errors: ", errors);
  }, [id, activityStore,errors]);

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement| HTMLTextAreaElement>) => {
    e.preventDefault();
    try {
      activityStore.setErrors([]);
        if(!activity.id){
            const createdActivity = await activityStore.createActivity(activity);
            navigate(`/activity/${createdActivity.id}`);
        } else {
            await activityStore.editActivity(activity);
            navigate(`/activity/${activity.id}`);
        }
        setErrors([]); // Clearing errors if submission is successful
    } catch (error:any) {
        const response = error
        activityStore.setErrors([error]);
        //console.log("errors: " + errors);
    }
};
// const handleSubmit = async (e: React.FormEvent<HTMLFormElement| HTMLTextAreaElement>) => {
//   e.preventDefault();
//   try {
//     const createdActivity = await activityStore.createActivity(activity);
//     // throw new Error("Manual throw");
//   } catch (error: any) {
//      console.error('Error caught:', error);
//      activityStore.setErrors([error]);
//   }
// };

  return (
    <>
    {id! ? (
      <>
        <p>test</p>
      </>
    ) : null}
    <Segment>

      <Formik initialValues={activity} onSubmit={values => console.log(values)}>
        {({values,handleChange,handleSubmit}) =>(
          <Form onSubmit={handleSubmit}>
          <Form.Input
            name="title"
            value={activity.title}
            onChange={handleChange}
            placeholder="Title"
            label="Title"
          />
          <Form.TextArea
            name="description"
            value={activity.description}
            onChange={handleChange}
            placeholder="Description"
            label="Description"
          />
          <Form.Input
            name="date"
            type="date"
            value={activity.date}
            onChange={handleChange}
            placeholder="Date"
            label="Date"
          />
          <Form.Input
            name="city"
            value={activity.city}
            onChange={handleChange}
            placeholder="City"
            label="City"
          />
          <Form.Input
            name="category"
            value={activity.category}
            onChange={handleChange}
            placeholder="Category"
            label="Category"
          />
          <Form.Input
            name="venue"
            value={activity.venue}
            onChange={handleChange}
            placeholder="Venue"
            label="Venue"
          />
          <Button primary type="submit" content="Submit" />
          <Button primary type="button" content="Cancel" />
        </Form>
        )}
      </Formik>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name="title"
          value={activity.title}
          onChange={handleChange}
          placeholder="Title"
          label="Title"
        />
        <Form.TextArea
          name="description"
          value={activity.description}
          onChange={handleChange}
          placeholder="Description"
          label="Description"
        />
        <Form.Input
          name="date"
          type="date"
          value={activity.date}
          onChange={handleChange}
          placeholder="Date"
          label="Date"
        />
        <Form.Input
          name="city"
          value={activity.city}
          onChange={handleChange}
          placeholder="City"
          label="City"
        />
        <Form.Input
          name="category"
          value={activity.category}
          onChange={handleChange}
          placeholder="Category"
          label="Category"
        />
        <Form.Input
          name="venue"
          value={activity.venue}
          onChange={handleChange}
          placeholder="Venue"
          label="Venue"
        />
        <Button primary type="submit" content="Submit" />
        <Button primary type="button" content="Cancel" />
      </Form>
    </Segment>
    {activityStore.errors  && <ErrorMessage  />}
    
    </>
  );
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
