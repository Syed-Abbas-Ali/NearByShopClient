import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useShopVerificationRequestMutation } from "../../apis&state/apis/shopApiSlice";
import backIcon from "../../assets/arrowLeftLarge.svg";
import ActiveDots from "../../components/activeDots/ActiveDots";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import FileUploadOne from "../../components/fileUploadOne/FileUploadOne";
import Input from "../../components/input/Input";
import { shopVerificationValidationSchema } from "../../utils/validations";
import "./shopVerification.scss";

const aadharVerificationFields = [
  {
    label: "Aadhar Number",
    name: "aadharNumber",
    placeholderText: "Enter your Aadhar Number",
  },
];

const currentBillVerificationFields = [
  {
    label: "GST Number",
    name: "gstNumber",
    placeholderText: "Enter GST Number",
  },
];

const ShopVerification = () => {
  const navigate = useNavigate();
  const { shopUid } = useParams();
  const [currentForm, setCurrentForm] = useState("AADHAR");
  const [aadharDetails, setAadharDetails] = useState({
    aadharNumber: "",
    gstNumber: "",
    aadharPic: "",
    electricityBillPic: "",
  });

  const [documentNames, setDocumentNames] = useState({
    aadharPic: "",
    electricityBillPic: "",
  });


  const [errors, setErrors] = useState({});
  const [verifyShop] = useShopVerificationRequestMutation();

  const handleSubmitButton = async () => {
    try {
      const { aadharNumber, gstNumber, aadharPic, electricityBillPic } =
        aadharDetails;
      const finalVerificationDetails = {
        document: {
          aadharNumber: aadharNumber,
          aadharImage: aadharPic,
          gstNumber: gstNumber,
          gstImage: electricityBillPic,
        },
        remarks: "", //admin verification
      };
      const response = await verifyShop({
        data: finalVerificationDetails,
        shopUid,
      });
      if (response?.data) {
        toast.success("Successfully submitted!");
        navigate("/profile");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      // if (err.inner) {
      //   const validationErrors = {};
      //   err.inner.forEach((error) => {
      //     validationErrors[error.path] = error.message;
      //   });
      //   setErrors(validationErrors);
      // }
    }
  };

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setAadharDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    try {
      await shopVerificationValidationSchema.validateAt(name, {
        [name]: value,
      });
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
    setCurrentForm("GST");
  };

  const formName =
    currentForm === "AADHAR" ? "Aadhar Verification" : "GST Verification";
  const fieldLabel =
    currentForm === "AADHAR" ? "Aadhar image" : "Electricity bill image";
  const fieldName =
    currentForm === "AADHAR" ? "aadharPic" : "electricityBillPic";
  const activeDotNumber = currentForm === "AADHAR" ? 1 : 2;
  const buttonText = currentForm === "AADHAR" ? "Next" : "Submit";
  const inputElements =
    currentForm === "AADHAR"
      ? aadharVerificationFields
      : currentBillVerificationFields;

  const handleFileEvent = (event, uploadedFileName, fileImage) => {
    const { name } = event.target;
    setAadharDetails((prevDetails) => ({
      ...prevDetails,
      [name]: fileImage,
    }));
    setDocumentNames((prev) => ({ ...prev, [name]: uploadedFileName }));
  };

  const handleBack = () => {
    if (currentForm == "AADHAR") {
      navigate(-1);
    } else {
      setCurrentForm("AADHAR");
    }
  };

  return (
    <div className="shop-verification-card">
      <div className="aadhar-verification-card-container">
        <div className="aadhar-verification-card">
          <div className="label-header-card">
            <button onClick={handleBack} className="back-btn">
              <img src={backIcon} alt="" />
            </button>
            <FormHeader formName={formName} />
          </div>
          <FileUploadOne
            fileLabel={fieldLabel}
            fieldName={fieldName}
            documentName={documentNames[fieldName]}
            handleFileChangeValue={handleFileEvent}
          />
          <div className="fields-card">
            <div className="fields-container">
              {inputElements.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input
                      initialData={item}
                      handleInput={handleInput}
                      value={aadharDetails[item.name]}
                    />
                    {item.name in errors && (
                      <p className="form-error-message">{errors[item.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="action-card">
              <button
                onClick={
                  currentForm === "AADHAR" ? handleNext : handleSubmitButton
                }
              >
                {buttonText}
              </button>
            </div>
            <ActiveDots activeDotNumber={activeDotNumber} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopVerification;
