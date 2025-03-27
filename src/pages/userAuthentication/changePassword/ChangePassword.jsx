import React, { useState } from "react";
import "./changePassword.scss";
import Input from "../../../components/input/Input";
import authUser from "../../../assets/setPasswordNewUser.svg";
import { useNavigate } from "react-router-dom";
import { changePasswordValidationSchema } from "../../../utils/validations";
import { useChangePasswordApiMutation } from "../../../apis&state/apis/authenticationApiSlice";
import toast from "react-hot-toast";
import AppBanner from "../../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";

const changePasswordFields = [
  {
    label: "Enter Password",
    name: "password",
    placeholderText: "Enter your New Password",
    type: "password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    placeholderText: "Confirm your password",
    type: "password",
  },
];

const ChangePassword = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [changePassword] = useChangePasswordApiMutation();

  const [changePasswordData, setChangePasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    try {
      await changePasswordValidationSchema.validate(changePasswordData, {
        abortEarly: false,
      });
      const { password, confirmPassword } = changePasswordData;
      if (password !== confirmPassword) {
        setErrors({
          confirmPassword: "Password must match !",
        });
        return;
      } else {
        setErrors({
          confirmPassword: "",
        });
      }
      const finalData = {
        password: changePasswordData.password,
      };
      const response = await changePassword(finalData);
      if (response?.data) {
        toast.success("Successfully changed password !");
        navigate("/login");
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

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setChangePasswordData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    try {
      await changePasswordValidationSchema.validateAt(name, { [name]: value });
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

  return (
    <div className="change-password-page">
      <AppBanner />
      <div className="change-password-card-container">
        <div className="change-password-card">
          <FormHeader formName="Set Your Password" />
          <img src={authUser} alt="user" className="auth-user" />
          <div className="fields-card">
            <div className="fields-container">
              {changePasswordFields.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input
                      initialData={item}
                      handleInput={handleInput}
                      value={changePasswordData[item.name]}
                    />
                    {item.name in errors && (
                      <p className="form-error-message">{errors[item.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="action-card">
              <button onClick={handleChangePassword}>Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
