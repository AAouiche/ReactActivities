import React, { useState, useEffect } from "react";
import { Segment,  Button, FormField, Label } from "semantic-ui-react";
import { useStore } from "../../../app/Stores/rootStore";
import { Activity } from "../../../app/models/activity";
import {  useNavigate, useParams } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrMessage from "../../../app/Errors/ErrMessage";
import { CustomTextInput } from "../../../app/form/customTextInput";
import { CustomTextArea } from "../../../app/form/customTextArea";
import { CustomSelect } from "../../../app/form/customSelect";
import { Options } from "../../../app/form/options";
import { CustomDate } from "../../../app/form/customDate";


export default function ActivityForm() {
  
  const { activityStore } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentDate = new Date().toISOString().split("T")[0];
  const [errors, setErrors] = useState<string[] | null>(null);
  const today = new Date();
 
  const [activity, setActivity] = useState<Activity>({
    id: undefined,
    title: "",
    description: "",
    date: new Date(currentDate),
    category: "",
    city: "",
    venue: "",
  });

  const activityValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date()
          .min(today, 'Date must be in the future')
          .required('Date is required')
          .nullable(),
    city: Yup.string().required('City is required'),
    category: Yup.string().required('Category is required'),
    venue: Yup.string().required('Venue is required')
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


const handleSubmit = async (values:Activity) => {
  try {
    activityStore.setErrors([]);
    if (!values.id) {
      const createdActivity = await activityStore.createActivity(values);
      //navigate(`/activity/${createdActivity.id}`);
    } else {
      await activityStore.editActivity(values);
      navigate(`/activity/${values.id}`);
    }
  } catch (error:any) {
    const response = error; // You might want to extract some info from error response
    activityStore.setErrors([error]); // Also, consider adding relevant error handling
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

      <Formik 
      validationSchema={activityValidationSchema} 
      initialValues={activity} 
      onSubmit={handleSubmit}>
        {({handleSubmit}) =>(
           <Form className="ui form" onSubmit={handleSubmit}>
           <CustomTextInput name="title" placeholder="Title" label="Title" />
           <CustomTextArea rows ={3} name="description" placeholder="Description" label="Description" />
           <CustomDate
             placeholderText="Date"
             timeCaption="time"
             dateFormat='MMMM d, yyyy h:mm aa'
             name="date"
             showTimeSelect
           />
           <CustomSelect options={Options}name="category" placeholder="Category" label="Category" />
           <CustomTextInput name="city" placeholder="City" label="City" />
           <CustomTextInput name="venue" placeholder="Venue" label="Venue" />
           
           <Button primary type="submit" content="Submit" />
           <Button type="button" content="Cancel" />
         </Form>
        )}
      </Formik>
      
    </Segment>
    {/* {activityStore.errors  && <ErrMessage  />} */}
    
    </>
  );
}

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
