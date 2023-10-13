import {  useField } from 'formik';
import React from 'react';
import { Form, Label, Select } from "semantic-ui-react";

interface Props{
  label?: string;
  placeholder:string;
  name: string;
  options:any;
 
}

export const CustomSelect: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <Select
      options={props.options}
      value={field.value || null}
      onChange={(_,d) =>helpers.setValue(d.value)} 
      onBlur={() => helpers.setTouched(true)}
      placeholder={props.placeholder}/>
      {meta.touched && meta.error ? (
        <Label basic color='red' pointing>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};