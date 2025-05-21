import React, { useState } from "react";
import "./login.scss";
import Input from "../../../components/input/Input";
import googleIcon from "../../../assets/googleIcon.svg";
import { useNavigate } from "react-router-dom";
import { useLoginApiMutation } from "../../../apis&state/apis/authenticationApiSlice";
import { loginValidationSchema } from "../../../utils/validations";
import AppBanner from "../../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../apis&state/state/authSlice";

const loginFields = [
  {
    label: "Email",
    name: "email",
    placeholderText: "Enter Your E-Mail",
  },
  {
    label: "Password",
    name: "password",
    placeholderText: "Enter Your Password",
    type: "password",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [userLogin] = useLoginApiMutation();

  const handleLogin = async () => {
    try {
      // Validate full form before submitting
      await loginValidationSchema.validate(loginData, { abortEarly: false });

      const finalData = { ...loginData };
      const response = await userLogin(finalData);

      if (response?.data) {
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
        dispatch(setLogin());
        navigate("/");
      } else if (response?.error) {
        const errorMessage =
          response?.error?.data?.errors[0]?.message || "Something went wrong!";
        if (response?.error?.data?.errors[0]?.message) {
          let errorField = response?.error?.data?.errors[0]?.message?.includes(
            "email"
          )
            ? "email"
            : "password";
          setErrors((prev) => ({
            ...prev,
            [errorField]: response?.error?.data?.errors[0]?.message,
          }));
        }
      } else {
        toast.error("Please try again!");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors); // Set validation errors to state
      }
    }
  };

  const handleInput = async (event) => {
    const { name, value } = event.target;
    setLoginData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    try {
      await loginValidationSchema.validateAt(name, { [name]: value });

      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name]; // Remove error when field is valid
        return newErrors;
      });
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    }
  };

  const handleForgotBtn = () => {
    navigate("/forgot-password");
  };

  const handleNavigateSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <AppBanner />
      <div className="login-card-container">
        <div className="login-card">
          <FormHeader
            welcomeText="Welcome to"
            formName="Login to start your Business"
          />
          <div className="fields-card">
            <div className="fields-container">
              {loginFields.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input
                      initialData={item}
                      handleInput={handleInput}
                      value={loginData[item.name]}
                    />
                    {item.name in errors && (
                      <p className="form-error-message">{errors[item.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="forgot-text" onClick={handleForgotBtn}>
              Forgot your password?
            </p>
            <div className="action-card">
              <button onClick={handleLogin}>Login</button>
              {/* <div className="or-card">- Or -</div>
              <button className="google-signup">
                <img src={googleIcon} alt="google" /> Login with Google
              </button> */}
            </div>
            <div className="account-question">
              <p>If you not have an account?</p>
              <span onClick={handleNavigateSignUp}>Create Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
