import React, { useState } from "react";
import "./forgotPassword.scss";
import Input from "../../../components/input/Input";
import authUser from "../../../assets/forgotPasswordNewUser.svg";
import { useNavigate } from "react-router-dom";
import { useForgetPasswordApiMutation } from "../../../apis&state/apis/authenticationApiSlice";
import { forgetPasswordValidationSchema } from "../../../utils/validations";
import toast from "react-hot-toast";
import AppBanner from "../../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";

const forgotFields = [
  {
    label: "Email",
    name: "email",
    placeholderText: "Enter Your E-mail or Phone number",
  },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailData, setEmailData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [forgetPassword] = useForgetPasswordApiMutation();

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setEmailData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    try {
      await forgetPasswordValidationSchema.validateAt(name, { [name]: value });
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
  const handleSubmit = async () => {
    try {
      await forgetPasswordValidationSchema.validate(emailData, {
        abortEarly: false,
      });
      const response = await forgetPassword(emailData);
      if (response?.data) {
        toast.success("Successfully sent OTP!");
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            accessToken: response?.data?.data.accessToken,
          })
        );
        navigate("/otp");
      } else if (response?.error) {
        const errorMessage = response?.error.data.errors[0].message;
        toast.error(errorMessage);
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
  return (
    <div className="forgot-password-page">
      <AppBanner />
      <div className="forgot-password-card-container">
        <div className="forgot-password-card">
          <FormHeader formName="Forgot Password" />
          <img src={authUser} alt="user" className="auth-user" />
          <div className="fields-card">
            <div className="fields-container">
              {forgotFields.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input initialData={item} handleInput={handleInput} value={emailData[item.name]}/>
                    <p className="form-error-message">{errors.email}</p>
                  </div>
                );
              })}
            </div>
            <div className="action-card">
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
