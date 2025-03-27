import React, { useState } from "react";
import "./aadharVerification.scss";
import Input from "../../components/input/Input";
import FileUploadOne from "../../components/fileUploadOne/FileUploadOne";
import ActiveDots from "../../components/activeDots/ActiveDots";
import { useNavigate } from "react-router-dom";
import ToggleYesNo from "../../components/toggleYesNo/ToggleYesNo";
import AppBanner from "../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import { useDispatch, useSelector } from "react-redux";
import { setShopVerificationDetails } from "../../apis&state/state/shopVerification";

const aadharVerificationFields = [
  {
    label: "Aadhar Number",
    name: "aadharNumber",
    placeholderText: "Enter your Aadhar Number",
  },
];

const AadharVerification = () => {
  const { shopVerificationDetails } = useSelector(
    (state) => state.shopVerificationState
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aadharDetails, setAadharDetails] = useState({
    aadharNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setAadharDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    dispatch(setShopVerificationDetails({ aadharNumber: value }));
    try {
      await aadharNumberValidationSchema.validateAt(name, { [name]: value });
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

  const handleNext = () => {
    navigate("/currentbill-verification/1");
  };

  return (
    <div className="aadhar-verification-page">
      <AppBanner />
      <div className="aadhar-verification-card-container">
        <div className="aadhar-verification-card">
          <FormHeader formName="Aadhar Verification" />
          <FileUploadOne fileLabel="Aadhar Card" />
          <div className="fields-card">
            <div className="fields-container">
              {aadharVerificationFields.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input initialData={item} handleInput={handleInput} />
                    {item.name in errors && (
                      <p className="form-error-message">{errors[item.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="action-card">
              <button onClick={handleNext}>Next</button>
            </div>
            <ActiveDots activeDotNumber={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadharVerification;
