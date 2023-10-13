import {  useField } from 'formik';
import React from 'react';
import { Form, Label } from "semantic-ui-react";

interface Props{
  label?: string;
  placeholder:string;
  name: string;
 
}

export const CustomTextInput: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color='red' pointing>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};