import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateShopMutation } from "../../apis&state/apis/shopApiSlice";
import sellerSelectMap from "../../assets/sellerSelectMap.png";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import Input from "../../components/input/Input";
import "./locationVerification.scss";
import * as Yup from "yup";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import Selector from "../../components/selector/Selector";
import { useUploadImageMutation } from "../../apis&state/apis/global";
import CustomMapComponent from "../../components/mapComponent/CustomMapComponent"; // Import the new map component

const locationFields = [
  {
    label: "Shop name",
    name: "shopName",
    placeholderText: "Enter your Shop Name",
    required: true,
  },
  {
    label: "Shop location address",
    name: "storeAddress",
    placeholderText: "Enter shop location address",
    required: true,
  },
  {
    label: "Shop category",
    name: "category",
    placeholderText: "Enter shop category",
    required: true,
  },
  {
    label: "Shop Description",
    name: "storeDescription",
    placeholderText: "Enter shop description (min 20 characters)",
    required: true,
    textarea: true,
  },
];

const shopValidationSchema = Yup.object().shape({
  shopName: Yup.string()
    // .required("Shop name is required")
    .min(3, "Shop name must be at least 3 characters"),
  storeAddress: Yup.string().required("Shop address is required"),
  category: Yup.string().required("Shop category is required"),
  storeDescription: Yup.string()
    .required("Shop description is required")
    .min(20, "Description must be at least 20 characters"),
  profile_url: Yup.string().required("Shop image is required"),
});

const LocationVerification = () => {
  const value = useSelector((state) => state.shopVerificationState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [createNewShop] = useCreateShopMutation();

  const [shopDetails, setShopDetails] = useState({
    shopName: "",
    storeAddress: "",
    category: "",
    storeDescription: "",
    profile_url: "",
    storeLocation: null,
  });

  const { data: categories } = useGetAllCategoriesAndSubCategoriesQuery();

  useEffect(() => {
    if (categories?.data?.length > 0) {
      const allCategoriesList = categories?.data?.map((category) => ({
        value: category.categoryId,
        label: category.name,
      }));
      setCategoriesList(allCategoriesList);
    }
  }, [categories]);

  const handleSetLocationDetails = (locationData) => {
    setShopDetails((prev) => ({
      ...prev,
      storeAddress: locationData.address,
      storeLocation: locationData.storeAddress.storeLocation,
    }));
    setErrors((prev) => ({ ...prev, storeLocation: undefined }));
  };

  const handleCategory = (data) => {
    const { label } = data;
    setShopDetails((prev) => ({
      ...prev,
      category: label,
    }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setShopDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    try {
      await shopValidationSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.message,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const shopFinalData = {
        storeName: shopDetails.shopName,
        profile_url: shopDetails.profile_url,
        category: shopDetails.category,
        storeDescription: shopDetails.storeDescription,
        storeLocation: shopDetails.storeLocation,
        storeAddress: shopDetails.storeAddress,
      };

      await shopValidationSchema.validate(shopFinalData, {
        abortEarly: false,
      });

      if (!shopDetails.storeLocation) {
        throw new Error("Please select a shop location on the map");
      }

      const response = await createNewShop(shopFinalData);

      if (response?.data) {
        toast.success("Store Created Successfully!");
        sessionStorage.setItem("user", JSON.stringify(response?.data.data));
        navigate(-1);
      } else {
        toast.error(response?.error?.data?.message || "Something went wrong!");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message || "Failed to create shop");
      }
    } finally {
      setLoading(false);
    }
  };

  const [uploadImage] = useUploadImageMutation();

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > 1024 * 1024) {
      return toast.error("File size should not exceed 1 MB!");
    }

    // Validate file type
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return toast.error("Only .jpg, .jpeg, .png, .webp formats are allowed.");
    }

    try {
      // Display preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShopDetails((prev) => ({
          ...prev,
          profile_url: e.target.result,
        }));
      };
      reader.readAsDataURL(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await uploadImage({
        data: formData,
        itemUid: null,
      });

      if (response?.data) {
        const { fileUrl } = response.data.data;
        setShopDetails((prev) => ({
          ...prev,
          profile_url: fileUrl,
        }));
        toast.success("Successfully uploaded your profile image!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="location-verification-container">
      <div className="location-verification-card">
        <FormHeader formName="Create Your Shop" />
        <div className="location-map-div">
          {showMap && (
            <div className="map-comp">
              <CustomMapComponent 
                handleSetLocationDetails={handleSetLocationDetails} 
              />
            </div>
          )}
          <div className="select-location-sample-card">
            <img src={sellerSelectMap} alt="Shop location selection" />
            {shopDetails.storeAddress && (
              <div className="selected-location-info">
                <h4>Selected Location:</h4>
                <p>{shopDetails.storeAddress}</p>
              </div>
            )}
            <button
              className="select-location-text-btn"
              onClick={() => setShowMap(!showMap)}
              disabled={loading}
            >
              {shopDetails.storeAddress
                ? "Change Shop Location"
                : "Select Shop Location"}
            </button>
          </div>
          {errors.storeLocation && (
            <p className="form-error-message">{errors.storeLocation}</p>
          )}
        </div>
        <div className="fields-card">
          {shopDetails?.profile_url && (
            <img src={shopDetails.profile_url} className="shop-profile-pic" alt="Shop profile" />
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
          />
          <div className="fields-container">
            {locationFields.map((item, index) => (
              <div key={index} className="input-single-card">
                <label>
                  {item.label}
                  {item.required && <span className="required">*</span>}
                </label>
                {item.name === "category" ? (
                  <Selector
                    onSelectDropdown={handleCategory}
                    dropdownList={categoriesList}
                    placeholderText={"Select Category"}
                    disabled={loading}
                  />
                ) : (
                  <Input
                    initialData={item}
                    handleInput={handleInput}
                    value={shopDetails[item.name]}
                    disabled={loading}
                    isTextarea={item.textarea}
                  />
                )}
                {errors[item.name] && (
                  <p className="form-error-message">{errors[item.name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="action-card">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={loading ? "loading" : ""}
            >
              {loading ? "Creating Shop..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationVerification;