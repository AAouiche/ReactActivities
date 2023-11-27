import { Formik } from "formik";
import * as Yup from "yup";
import { useStore } from "../Stores/rootStore";
import Debug from "../Debug/Debug";
import { Link, useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is a required field")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required field")
    .min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const { userStore } = useStore();
  const navigate = useNavigate();
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: "", displayName: "", password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        try {
          await userStore.register(values);
          navigate('/activities');
          console.log('Registered', values);
        } catch (error) {
          console.error('Registration failed', error);
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
              <span>Register</span>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter email"
                className="form-control inp_text"
                id="email"
              />
              <p className="error">
                {errors.email && touched.email && errors.email}
              </p>
              <input
                type="text"
                name="displayName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.displayName}
                placeholder="Enter displayName"
                className="form-control"
              />
              <p className="error">
                {errors.displayName && touched.displayName && errors.displayName}
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
             
             
              <button type="submit">Register</button>

            </form>
            <div className="action-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}