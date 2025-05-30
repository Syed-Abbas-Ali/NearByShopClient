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
import { useUploadImageMutation } from "../../../../apis&state/apis/global";

const ProfileHeader = () => {
  const userImage = useRef();
  const [profilePic, setProfilePic] = useState(null);
    const [uploadImage] = useUploadImageMutation();
  const [showProfileEditPopup, setShowProfileEditPopup] = useState(false);
  
  const {
    data: userProfileData,
    isLoading: isUserProfileDataLoading,
    isError: isUserProfileDataError,
    refetch
  } = useGetProfileApiQuery();

  const handleImageChange = async (event, imageType) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 1024 * 1024) {
      return toast.error("File size should not exceed 1 MB!");
    }
    if (
      selectedFile.name.endsWith(".jpg") ||
      selectedFile.name.endsWith(".jpeg") ||
      selectedFile.name.endsWith(".png") ||
      selectedFile.name.endsWith(".webp")
    ) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (selectedFile) {
        // const imageUrl = URL.createObjectURL(selectedFile);
        // setSelectedImage(imageUrl);

        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
          const response = await uploadImage({
            data: formData,
            type: imageType,
            itemUid:
              imageType === "THUMBNAILS" ? value?.shopUid.split("&")[1] : "",
          });
          if (response?.data && imageType !== "THUMBNAILS") {
            refetch()
            toast.success("Successfully uploaded your profile image!");
          }
        } catch (error) {
          console.log(error)
          toast.error("Something went wrong");
        }
      }
    } else {
      toast.error("It will allow .jpg, .jpeg, .png, .webp formats only.");
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
        <img src={userProfileData?.data?.profilePic} className="profilePic"/>
        <input type="file" name="" onChange={(e) => handleImageChange(e, "PROFILE_PIC")} id="invisible_file_upload" />
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
