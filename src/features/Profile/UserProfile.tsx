import { Formik,  Field, ErrorMessage } from 'formik';
import { Segment,Image, Header ,Form, Button, Input} from 'semantic-ui-react';
import * as Yup from 'yup';
import { CustomTextInput } from '../../app/form/customTextInput';
import { useStore } from '../../app/Stores/rootStore';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';

const UserProfile = () => {
    const { userStore } = useStore();
    const profilePicture = userStore.user?.imageUrl;
    const [selectedImage, setSelectedImage] = useState(profilePicture);
    const handleImageChange = (e: any) => {
        console.log("start",performance.now());
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
    
        
            const acceptedFormats = ['image/jpeg', 'image/png']; 
            if (!acceptedFormats.includes(file.type)) {
                
                alert('Please upload an image of format: .jpeg or .png');
                return;
            }
            setSelectedImage("xd");
           // console.log("selected before",selectedImage);
            const reader = new FileReader();
    
            reader.onload = (event) => {
                 
                if (event.target && typeof event.target.result === 'string') {
                    //console.log("Before setSelectedImage call", selectedImage);
                   // setSelectedImage(event.target.result);
                    //console.log("After setSelectedImage call", selectedImage);
                    userStore.uploadProfileImage(file);
                    // console.log("File selected:", file);
                    // console.log("Reader loaded:", event.target.result);
                    // console.log("selected",selectedImage);
                    // console.log("Selected file detail:", e.target.files[0]);
                    console.log("end",performance.now())
                }

            };
            
            reader.readAsDataURL(file);
        }
    }
    useEffect(() => {
        const disposer = autorun(() => {
          console.log('Image URL changed:', userStore.user?.imageUrl);
        });
    
        return () => disposer(); // This will dispose of the autorun when the component unmounts
      }, []);

    return (
        <Segment>
            <label style={{ cursor: 'pointer' }}>
                <Image src={userStore.user?.imageUrl || '/assets/user.png'} size='small' circular centered />
                <input type="file" hidden onChange={handleImageChange} />
            </label>
            
            <Header as='h2' textAlign='center'>Edit Profile</Header>

            <Formik
                initialValues={{
                    name: 'John Doe',
                    bio: 'Web Developer. Loves coding and exploring new technologies. Passionate about creating innovative solutions.'
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                             .max(50, 'Must be 50 characters or less')
                             .required('Required'),
                    bio: Yup.string()
                            .max(200, 'Must be 200 characters or less'),
                })}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {() => (
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <Field name="name" placeholder="Name" as={Input} />
                            
                        </Form.Field>
                        <CustomTextInput name='DisplayName' label='DisplayName' placeholder='DisplayName'/>
                        
                        <CustomTextInput name='Bio' label='Bio' placeholder='Bio'/>

                        <Button type="submit">Update Profile</Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(UserProfile);