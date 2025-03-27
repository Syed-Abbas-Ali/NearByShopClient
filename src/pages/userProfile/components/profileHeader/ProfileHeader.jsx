import React, { useRef, useState } from "react";
import "./profileHeader.scss";
import userMask from "../../../../assets/userMask.svg";
import {
  useCreateProfilePicApiMutation,
  useGetProfileApiQuery,
  useGetProfilePicApiQuery,
} from "../../../../apis&state/apis/authenticationApiSlice";
import toast from "react-hot-toast";
import editIcon from "../../../../assets/editNewIcon.svg";
import ProfileEditPopup from "../profileEditPopup/ProfileEditPopup";

const ProfileHeader = () => {
  const userImage = useRef();
  const [profilePic, setProfilePic] = useState(null);
  const [showProfileEditPopup, setShowProfileEditPopup] = useState(false);

  const {
    data: profilePicData,
    isLoading: isProfilePicDataLoading,
    isError: isProfilePicDataError,
  } = useGetProfilePicApiQuery();

  const {
    data: userProfileData,
    isLoading: isUserProfileDataLoading,
    isError: isUserProfileDataError,
  } = useGetProfileApiQuery();
  const [uploadProfilePic] = useCreateProfilePicApiMutation();

  const handleProfilePic = async (event) => {
    const fileName = event.target.files[0];
    if (fileName && fileName.size > 10 * 1024 * 1024) {
      return toast.error("File size should not exceed 1 MB");
    }
    if (
      fileName.name.endsWith(".png") ||
      fileName.name.endsWith(".jpg") ||
      fileName.name.endsWith(".jpeg") ||
      fileName.name.endsWith(".webp")
    ) {
      if (fileName) {
        const imageLink = URL.createObjectURL(fileName);
        setProfilePic(imageLink);
        const profilePicData = new FormData();
        profilePicData.append("file", fileName);
        try {
          const response = await uploadProfilePic(profilePicData);
          if (response?.data) {
            toast.success("Profile pic uploaded successfully");
          } else {
            toast.error("Something went wrong");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    } else {
      toast.error("It accepts only .jpeg, .jpg, .png, .webp image format");
    }
  };
  const handleClickProfile = () => {
    userImage.current.click();
  };

  const handleEdit = () => {
    setShowProfileEditPopup((prev) => !prev);
  };

  return (
    <div className="profile-header">
      {showProfileEditPopup && <ProfileEditPopup handleEdit={handleEdit} userProfileData={userProfileData?.data}/>}
      <div className="profile-image" onClick={handleClickProfile}>
        <img src={userMask} />
      </div>
      <div className="user-details">
        <div className="name-heading">
          <h2>
            {userProfileData?.data.firstName} {userProfileData?.data.lastName}{" "}
            {!userProfileData && "Olivia Austin"}
          </h2>
          <img src={editIcon} alt="" onClick={handleEdit} />
        </div>
        <p className="phone-number">
          +91 {userProfileData?.data?.phone} {!userProfileData && "8647456457"}
        </p>
        <p className="mail">
          {userProfileData?.data?.email}{" "}
          {!userProfileData && "oliviaaustin@gmail.com"}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
