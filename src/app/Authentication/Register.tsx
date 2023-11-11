import { Formik } from "formik";
import * as Yup from "yup";
import { useStore } from "../Stores/rootStore";
import Debug from "../Debug/Debug";

const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
      username: Yup.string()
      .required("Username is a required field")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase char")
      .matches(/[A-Z]/, "Password must contain at least one uppercase char")
      .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, "Password must contain at least one number")
      .matches(/[0-9]/, "Password must contain a number")
      .matches(/[@$!%*?&#]/, "Password must contain a special character"),
  });

export default function Register() {
  const { userStore } = useStore();
  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: "", username: "", password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        try {
          await userStore.register(values);
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
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                placeholder="Enter username"
                className="form-control"
              />
              <p className="error">
                {errors.username && touched.username && errors.username}
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
             
              <p className="error">
                {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
              </p>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}
    </Formik>
  );
}