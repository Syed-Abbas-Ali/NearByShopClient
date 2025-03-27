import React, { useState } from "react";
import "./signup.scss";
import Input from "../../../components/input/Input";
import googleIcon from "../../../assets/googleIcon.svg";
import { useNavigate } from "react-router-dom";
import { useSignupApiMutation } from "../../../apis&state/apis/authenticationApiSlice";
import toast from "react-hot-toast";
import { signupValidationSchema } from "../../../utils/validations";
import AppBanner from "../../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import TermsAndConditions from "../../../components/commonComponents/termsAndConditions/TermsAndConditions";

const signupFields = [
  {
    label: "Name",
    name: "name",
    placeholderText: "",
  },
  {
    label: "Email",
    name: "email",
    placeholderText: "Enter Your E-Mail",
  },
  {
    label: "Phone Number",
    name: "phone",
    placeholderText: "Enter Your Phone Number",
  },
  {
    label: "Password",
    name: "password",
    placeholderText: "Enter Your Password",
    type: "password",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState();
  const [createUser] = useSignupApiMutation();
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    termsAndCondition: false,
  });

  const handleSignup = async () => {
    try {
      await signupValidationSchema.validate(userDetails, { abortEarly: false });
      const finalData = {
        ...userDetails,
        role: "USER",
      };
      const response = await createUser(finalData);
      if (response?.data) {
        toast.success("Successfully created account!");
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            role: "USER",
            accessToken: response?.data.data.accessToken,
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

  const handleInput = async (inputObject) => {
    const { name } = inputObject.target;
    const value = inputObject.target?.id
      ? inputObject.target.checked
      : inputObject.target.value;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    try {
      await signupValidationSchema.validateAt(name, { [name]: value });
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

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      {showPopup && <TermsAndConditions setShowPopup={setShowPopup} />}
      <AppBanner />
      <div className="signup-card-container">
        <div className="signup-card">
          <FormHeader welcomeText="Welcome to" formName="Create Your Account" />
          <div className="fields-card">
            <div className="fields-container">
              {signupFields.map((item, index) => {
                if (item.name === "name") {
                  return (
                    <div className="name-card" key={index}>
                      <label>Name</label>
                      <div>
                        <Input
                          initialData={{
                            ...item,
                            name: "firstName",
                            placeholderText: "First Name",
                          }}
                          handleInput={handleInput}
                          value={userDetails["firstName"]}
                        />
                        <Input
                          handleInput={handleInput}
                          initialData={{
                            ...item,
                            name: "lastName",
                            placeholderText: "Last Name",
                          }}
                          value={userDetails["lastName"]}
                        />
                      </div>
                      {errors?.firstName || errors?.lastName ? (
                        <div className="name-errors">
                          <p className="form-error-message">
                            {errors.firstName}
                          </p>
                          <p className="form-error-message">
                            {errors.lastName}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="input-single-card">
                      <label>{item.label}</label>
                      <Input
                        initialData={item}
                        handleInput={handleInput}
                        value={userDetails[item.name]}
                      />
                      {item.name in errors && (
                        <p className="form-error-message">
                          {errors[item.name]}
                        </p>
                      )}
                    </div>
                  );
                }
              })}
              <div className="terms-and-conditions-card">
                <div className="terms-and-conditions">
                  <input
                    type="checkbox"
                    name="termsAndCondition"
                    id="termsAndCondition"
                    onChange={handleInput}
                  />
                  <label>
                    By registering, I agree to the{" "}
                    <span onClick={() => setShowPopup((prev) => !prev)}>
                      Terms of Service and Privacy
                    </span>{" "}
                    policy
                  </label>
                </div>
                <p className="form-error-message">
                  {errors.termsAndConditions}
                </p>
              </div>
            </div>
            <div className="action-card">
              <button onClick={handleSignup}>Sign Up</button>
              {/* <div className="or-card">- Or -</div> */}
              {/* <button className="google-signup">
                <img src={googleIcon} alt="google" /> Sign up with Google
              </button> */}
            </div>
            <div className="account-question">
              <p>If you already have an account?</p>
              <span onClick={handleNavigateLogin}>Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
