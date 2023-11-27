import { Formik } from "formik";
import * as Yup from "yup";
import agent from "../api/agent";
import { useStore } from "../Stores/rootStore";
import Debug from "../Debug/Debug";
import { Link, useNavigate } from "react-router-dom";



//Reference: https://medium.com/how-to-react/create-a-login-form-using-formik-in-react-js-240428a2f480
// Creating schema
const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is a required field")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const {userStore} = useStore();
  const navigate = useNavigate();
  return (
    <>
    
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
              await userStore.login(values); 
              navigate('/activities');
              console.log('Logged in', values);
          } catch (error) {
              console.error('Login failed', error); 
          }
      }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="login">
            <div className="form">
           
              <form noValidate onSubmit={handleSubmit}>
                <span>Login</span>
              
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="Enter email id / username"
                  className="form-control inp_text"
                  id="email"
                />
               
                <p className="error">
                  {errors.email && touched.email && errors.email}
                </p>
               
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Enter password"
                  className="form-control"
                />
               
                <p className="error">
                  {errors.password && touched.password && errors.password}
                </p>
              
                <button type="submit">Login</button>
              </form>
              <div className="action-link">
                Don't have an account? <Link to="/register">Register</Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
      
    </>
  );
}
