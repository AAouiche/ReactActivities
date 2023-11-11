import {  useField } from 'formik';
import React from 'react';
import { Form, Label } from "semantic-ui-react";

interface Props{
  label?: string;
  placeholder:string;
  name: string;
 
}

export const CustomTextInput: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <input {...props} {...field} />
      {meta.touched && meta.error ? (
        <Label basic color='red' pointing>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};