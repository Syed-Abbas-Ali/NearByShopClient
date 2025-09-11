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
// --- CHANGE 1: Import 'loginSuccess' instead of 'setLogin' ---
import { loginSuccess } from "../../../apis&state/state/authSlice";
import toast from "react-hot-toast";
import CircularLoader from "../../../components/circularLoader/CircularLoader";

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

  const [userLogin, { isLoading }] = useLoginApiMutation();

  const handleLogin = async () => {
    try {
      // Validate full form before submitting
      await loginValidationSchema.validate(loginData, { abortEarly: false });

      const finalData = { ...loginData };
      const response = await userLogin(finalData);

      if (response?.error?.status === 422) {
        // This part for OTP seems correct, so we keep it.
        localStorage.setItem(
          "user",
          JSON.stringify(response?.error?.data?.data)
        );
        toast.error(response?.error?.data?.message);
        navigate("/otp");
      } else if (response?.data) {
        // --- CHANGE 2: This is the updated success logic ---

        // 1. Get the complete user object from the API response.
        // This object should include the token.
        const userData = response.data.data;

        // 2. Dispatch the new 'loginSuccess' action and pass the user object.
        // The authSlice will automatically handle saving the token to the Android App
        // and the full user object to localStorage for the website.
        dispatch(loginSuccess(userData));

        // 3. Show a success message and navigate.
        toast.success("Login Successful!");
        navigate("/");

      } else if (response?.error) {
        // This existing error handling is fine.
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
        setErrors(validationErrors);
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
        delete newErrors[name];
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
              <button onClick={handleLogin}>
                {isLoading ? <CircularLoader /> : "Login"}
              </button>
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