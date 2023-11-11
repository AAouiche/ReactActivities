import { Formik,  Field, ErrorMessage } from 'formik';
import { Segment,Image, Header ,Form, Button, Input, Icon} from 'semantic-ui-react';
import * as Yup from 'yup';
import { CustomTextInput } from '../../app/form/customTextInput';
import { useStore } from '../../app/Stores/rootStore';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';

const UserProfile = () => {
    const { userStore } = useStore();
    const profilePicture = userStore.user?.imageUrl;
    var user = userStore.user;
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
                    userStore.setImage(event.target.result);
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
    
        return () => disposer(); 
      }, []);

    return (
        <Segment textAlign="center" style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
            <label className="image-wrapper">
            <Image src={userStore.user?.imageUrl || '/assets/user.png'} size='small' circular centered />
            <div className="image-overlay">
            <Icon name="write" />
            </div>
            <input type="file" hidden onChange={handleImageChange} />
            </label>
            
            <Header as='h2' textAlign='center'>Edit Profile</Header>

            <Formik
                initialValues={{
                    email: user?.email || '', 
                    displayName: user?.displayName || '',
                    biography: user?.biography || '',
                }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Required'), 
                    displayName: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
                    biography: Yup.string().max(200, 'Must be 200 characters or less'),
                })}
                onSubmit={(values) => {
                    userStore.editUser(values);
                    console.log("valueessssssss",values);
                    console.log("valueessssssss");
                }}
            >
                {(Props) => (
                    <Form onSubmit={Props.handleSubmit}>
                        
                        <CustomTextInput name='email' label='Email' placeholder='Email'/>
                        <CustomTextInput name='displayName' label='DisplayName' placeholder='DisplayName'/>
                        
                        <CustomTextInput name='biography' label='biography' placeholder='Biography'/>

                        <Button type="submit">Update Profile</Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(UserProfile);