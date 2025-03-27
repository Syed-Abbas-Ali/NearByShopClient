import React, { useEffect, useState } from "react";
import "./profileEditPopup.scss";
import cancelIcon from "../../../../assets/cancelIconRed.svg";
import { userProfileEditValidationSchema } from "../../../../utils/validations";
import Input from "../../../../components/input/Input";
import { useUpdateProfileDetailsApiMutation } from "../../../../apis&state/apis/authenticationApiSlice";
import toast from "react-hot-toast";

const profileEditFields = [
  {
    label: "First Name",
    name: "firstName",
    placeholderText: "Enter first name",
  },
  {
    label: "Last Name",
    name: "lastName",
    placeholderText: "Enter last name",
  },
];

let defaultUserFields = {
  firstName: "",
  lastName: "",
};

const ProfileEditPopup = ({ handleEdit, userProfileData }) => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});

  const [updateProfile] = useUpdateProfileDetailsApiMutation();

  useEffect(()=>{
    setUserDetails({
        firstName : userProfileData.firstName,
        lastName : userProfileData.lastName
    })
  },[])

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
      await userProfileEditValidationSchema.validateAt(name, { [name]: value });
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

  const handleCancel = () => {
    handleEdit();
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "Parent") {
      handleCancel();
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProfile(userDetails);
      if (response?.data) {
        toast.success("Profile updated!");
        handleEdit()
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="profile-edit-popup"
      id="Parent"
      onClick={handleOutsideClick}
    >
      <div className="content">
        <div className="cancel-icon-card">
          <img src={cancelIcon} alt="" onClick={handleCancel} />
        </div>
        <div className="fields-card">
          {profileEditFields.map((item, index) => (
            <div key={index} className="input-single-card">
              <label>{item.label}</label>
              <Input
                initialData={item}
                handleInput={handleInput}
                value={userDetails[item.name]}
              />
              {item.name in errors && (
                <p className="form-error-message">{errors[item.name]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="save-action-card">
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPopup;
