import React, { useEffect, useState } from "react";
import "./sellerProfileEdit.scss";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import cameraIconOne from "../../assets/cameraIcon.svg";
import ToggleYesNo from "../../components/toggleYesNo/ToggleYesNo";
import locationImage from "../../assets/locationPoint.svg";
import Input from "../../components/input/Input";
import Navbar from "../../components/navbar1/Navbar";
import {
  useGetSingleShopsApiQuery,
  useUpdateShopApiMutation,
} from "../../apis&state/apis/shopApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import BusinessDetailsVideo from "../../components/commonComponents/businessDetailsVideo/BusinessDetailsVideo";
import toast from "react-hot-toast";
import { useUploadImageMutation } from "../../apis&state/apis/global";

// const socialMediaLinksList = [
//   {
//     label: "Instagram account name",
//     name: "instagramAccountName",
//     placeholderText: "Enter Instagram account name",
//   },
//   {
//     label: "Instagram URL",
//     name: "instagramUrl",
//     placeholderText: "Enter Instagram URl",
//   },
//   {
//     label: "Youtube account name",
//     name: "youtubeAccountName",
//     placeholderText: "Enter Youtube account name",
//   },
//   {
//     label: "Youtube URL",
//     name: "youtubeUrl",
//     placeholderText: "Enter Youtube URL",
//   },
// ];

const profileBasicFields = [
  {
    label: "Shop Name",
    name: "shopName",
    placeholderText: "Enter shop name",
  },
  // {
  //   label: "First Name",
  //   name: "first_name",
  //   placeholderText: "Enter your name",
  // },
  //   {
  //   label: "Last Name",
  //   name: "last_name",
  //   placeholderText: "Enter your name",
  // },
  {
    label: "Contact Number",
    name: "phone",
    placeholderText: "Enter contact number",
  },
];

const shopDetailsFields = [
  {
    label: "Shop address",
    name: "shopAddress",
    placeholderText: "Enter shop address",
  },
  {
    label: "Store description",
    name: "shopDescription",
    placeholderText: "Enter store description",
  },
  // {
  //   label: "Shop email",
  //   name: "email",
  //   placeholderText: "Enter shop email",
  // },
  {
    label: "Shop Category",
    name: "category",
    placeholderText: "Enter shop category",
  },
  {
    label: "Shop state",
    name: "state",
    placeholderText: "Enter shop state",
  },
  {
    label: "Shop city",
    name: "city",
    placeholderText: "Enter shop city",
  },
  {
    label: "Shop phone number",
    name: "phone",
    placeholderText: "Enter shop phone number",
  },
  {
    label: "X Link",
    name: "xLink",
    placeholderText: "Enter X link",
  },
  {
    label: "Instagram Link",
    name: "instagramLink",
    placeholderText: "Enter Instagram Link",
  },
  {
    label: "Website",
    name: "website",
    placeholderText: "Enter your website",
  },
];

const shopDefaultDetails = {
  shopName: "",
  shopAddress: "",
  shopDescription: "",
  email: "",
  state: "",
  category: "",
  city: "",
  phone: "",
  xLink: "",
  website: "",
  instagramLink: "",
};

const SellerProfileEdit = () => {
  const value = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [updateShopDetails, setUpdateShopDetails] =
    useState(shopDefaultDetails);
  const [updateSellerDetails] = useUpdateShopApiMutation();
  const [uploadImage] = useUploadImageMutation();

  const {
    data: shopDetails,
    isLoading,
    isError,
    refetch,
  } = useGetSingleShopsApiQuery(value?.shopUid);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdateShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (shopDetails?.data) {
      const prevAddedDetails = {
        shopName: shopDetails?.data?.shop_name || "",
        shopAddress: shopDetails?.data?.shop_address,
        shopDescription:
          shopDetails?.data?.shop_description || "Book your bus tickets.",
        email: shopDetails?.data?.shop_email,
        state: "Telanaga",
        category: "Electronics",
        city: "Hyderabad",
        phone: shopDetails?.data?.shop_contact?.phone,
        xLink: shopDetails?.data?.shop_contact?.xLink,
        website: shopDetails?.data?.shop_contact?.website,
        instagramLink: shopDetails?.data?.shop_contact?.instagramLink,
      };
      setUpdateShopDetails((prev) => ({ ...prev, ...prevAddedDetails }));
    }
  }, [shopDetails]);

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
            refetch();
            toast.success("Successfully uploaded your profile image!");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    } else {
      toast.error("It will allow .jpg, .jpeg, .png, .webp formats only.");
    }
  };

  const handleUpdate = async () => {
    const finalSellerUpdateDetails = {
      storeName: updateShopDetails.shopName,
      storeAddress: updateShopDetails.shopAddress,
      storeLocation: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      storeDescription: updateShopDetails.shopDescription,
      // email: updateShopDetails.email,
      state: updateShopDetails.state,
      category: updateShopDetails.category,
      city: updateShopDetails.city,
      shopContactInfo: {
        phone: updateShopDetails.phone,
        xLink: updateShopDetails.xLink,
        website: updateShopDetails.website,
        instagramLink: updateShopDetails.instagramLink,
      },
    };
    try {
      const response = await updateSellerDetails({
        updateShopData: finalSellerUpdateDetails,
        shopUid: value?.shopUid,
      });
      if (response?.data || response?.message) {
        toast.success("Updated successfully!");
        navigate(-1);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="seller-edit-profile">
        <div className="desktop-left-card">
          <h3 className="page-header">My Account</h3>
          <div className="profile-image-edit">
            <div className="default-image-card">
              <img
                src={shopDetails?.data?.profile_pic}
                alt=""
                className="profilePic"
              />
              <input
                type="file"
                name=""
                onChange={(e) => handleImageChange(e, "PROFILE_PIC")}
                id="invisible_file_upload"
              />
            </div>
            <div className="basic-fields">
              {profileBasicFields.map((item, index) => {
                return (
                  <div key={index} className="input-single-card">
                    <label>{item.label}</label>
                    <Input
                      initialData={item}
                      handleInput={handleInput}
                      value={updateShopDetails[item.name]}
                    />
                    {item.name in errors && (
                      <p className="form-error-message">{errors[item.name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="left-card">
            <div className="account-public-card">
              <h3>Do you want your Account in Public? </h3>
              <ToggleYesNo />
            </div>
            <p>
              (If you keep it in Public out of your contacts Customer can see
              your website)
            </p>
          </div>
          {/* <div className="video-location-section">
            <div className="about-my-business">
              <h3>About my Business</h3>
              <div className="video-div">
                <BusinessDetailsVideo />
              </div>
            </div>
            <div className="select-location">
              <div className="heading">
                <img src={locationImage} alt="" />
                <h3>Select Your Location</h3>
              </div>
              <div className="location-default-image"></div>
            </div>
          </div> */}
          <div className="fields-container">
            {shopDetailsFields.map((item, index) => {
              return (
                <div key={index} className="input-single-card">
                  {/* {index % 2 === 0 && <p>Optional</p>} */}
                  <label>{item.label}</label>
                  <Input
                    initialData={item}
                    handleInput={handleInput}
                    value={updateShopDetails[item.name]}
                  />
                  {item.name in errors && (
                    <p className="form-error-message">{errors[item.name]}</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="save-btn">
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
        <div className="desktop-video-location-section">
          {/* <div className="about-my-business">
            <h3>About my Business</h3>
            <div className="video-div"></div>
          </div> */}
          <div className="select-location">
            <div className="heading">
              <img src={locationImage} alt="" />
              <h3>Select Your Location</h3>
            </div>
            <div className="location-default-image"></div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default SellerProfileEdit;
