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
          .required('Date is required'),
          
    city: Yup.string().required('City is required'),
    category: Yup.string().required('Category is required'),
    venue: Yup.string().required('Venue is required')
  });

  
  useEffect(() => {
    if (id) {
      const activityToEdit = activityStore.getActivity(id);
      console.log("activitytoedit ",activityToEdit)
      if (activityToEdit) {
        console.log("beforeset ",activity)
        setActivity(activityToEdit);
        console.log("afterset ",activity)
      } else {
        setErrors(['The activity you are trying to edit cannot be found.']);
      }
    }
    
    console.log("errors: ", errors);
  }, [id, activityStore,errors]);

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
};
const handleCancel = () => {
  if (id) {
      navigate(`/activity/${id}`);
  }
};


const handleSubmit = async (values:Activity) => {
  try {
    activityStore.setErrors([]);
    if (values.id == undefined) {
      const createdActivity = await activityStore.createActivity(values);
      //navigate(`/activity/${createdActivity.id}`);
    } else {
      await activityStore.editActivity(values);
      navigate(`/activity/${values.id}`);
    }
  } catch (error:any) {
    const response = error; 
    activityStore.setErrors([error]);
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
    
    <Segment padded="very">

      <Formik 
      validationSchema={activityValidationSchema} 
      initialValues={activity} 
      enableReinitialize 
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
           {id && (
            <Button type="button" content="Cancel" onClick={handleCancel} />
           )}
         </Form>
        )}
      </Formik>
      
    </Segment>
    {/* {activityStore.errors  && <ErrMessage  />} */}
    
    </>
  );
}


