import { useField } from 'formik';
import { Form, Label } from "semantic-ui-react";

interface FileInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  accept?: string;
}

export const CustomFileInput: React.FC<FileInputProps> = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      helpers.setValue(file);  
    }
  };

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <input type="file" {...props} onChange={handleFileChange} />
      {meta.touched && meta.error ? (
        <Label basic color='red' pointing>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
};
