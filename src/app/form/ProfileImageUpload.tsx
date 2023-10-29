import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../Stores/rootStore';


const ImageUploadSchema = Yup.object().shape({
    imageFile: Yup.mixed().required("A file is required")
});

const ProfileImageUpload = () => {
    const {  userStore } = useStore();

    return (
        <div>
            <h3>Upload Profile Image</h3>
            <Formik
                initialValues={{
                    imageFile: undefined
                }}
                validationSchema={ImageUploadSchema}
                onSubmit={(values, { setSubmitting }) => {
                    userStore.uploadProfileImage(values.imageFile).then(() => {
                        setSubmitting(false);
                    });
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form>
                        <div>
                            <label htmlFor="imageFile">Profile Image</label>
                            <input 
                                id="imageFile" 
                                name="imageFile" 
                                type="file" 
                                onChange={(event) => {
                                    setFieldValue("imageFile", event.currentTarget.files![0]);
                                }}
                            />
                        </div>
                        <div>
                            <button type="submit" disabled={isSubmitting}>
                                Upload
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default ProfileImageUpload;