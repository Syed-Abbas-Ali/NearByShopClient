import React, { useState } from "react";
import "./currentbillVerification.scss";
import Input from "../../components/input/Input";
import FileUploadOne from "../../components/fileUploadOne/FileUploadOne";
import { useNavigate } from "react-router-dom";
import ActiveDots from "../../components/activeDots/ActiveDots";
import AppBanner from "../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import { useShopVerificationRequestMutation } from "../../apis&state/apis/shopApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setShopVerificationDetails } from "../../apis&state/state/shopVerification";

const currentBillVerificationFields = [
  {
    label: "GST Number",
    name: "gstNumber",
    placeholderText: "Enter GST Number",
  },
];

const CurrentbillVerification = () => {
  const { shopVerificationDetails } = useSelector(
    (state) => state.shopVerificationState
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cuurentBillDetails, setCurrentBillDetails] = useState({
    gstNumber: "",
    currentBillImage: "",
  });
  const [errors, setErrors] = useState({});

  const [verifyRequest] = useShopVerificationRequestMutation();

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setCurrentBillDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    dispatch(setShopVerificationDetails({ gstNumber: value }));
    try {
      await currentBillValidationSchema.validateAt(name, { [name]: value });
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
    // try {
    //   const response=await verifyRequest()
    //   if (response.data){}
    // } catch (error) {
    //   console.log(error);
    // }
    navigate("/thankyou");
  };

  const handleCurrentBillImage = (value) => {
    dispatch(setShopVerificationDetails({ currentBillImage: value }));
  };

  return (
    <div className="current-bill-verification-page">
      <AppBanner />
      <div className="current-bill-verification-card-container">
        <div className="current-bill-verification-card">
          <FormHeader formName="Location Verification" />
          <div className="fields-card">
            <div className="fields-container">
              {currentBillVerificationFields.map((item, index) => {
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
            <div className="label-card">
              <p>Electricity Bill</p>
              <FileUploadOne fileLabel="Current Bill" handleFileChange={handleCurrentBillImage}/>
            </div>
            <div className="action-card">
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <ActiveDots activeDotNumber={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentbillVerification;
