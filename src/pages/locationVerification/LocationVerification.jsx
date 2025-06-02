import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateShopMutation } from "../../apis&state/apis/shopApiSlice";
import sellerSelectMap from "../../assets/sellerSelectMap.png";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import Input from "../../components/input/Input";
import "./locationVerification.scss";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as Yup from "yup";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import Selector from "../../components/selector/Selector";
import { useUploadImageMutation } from "../../apis&state/apis/global";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

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
    .required("Shop name is required")
    .min(3, "Shop name must be at least 3 characters"),
  storeAddress: Yup.string().required("Shop address is required"),
  category: Yup.string().required("Shop category is required"),
  storeDescription: Yup.string()
    .required("Shop description is required")
    .min(20, "Description must be at least 20 characters"),
  profile_url: Yup.string().required("Shop image is required"),
});

const LocationMarker = ({ setShopDetails, setErrors }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding using Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name || "Selected location";
          setShopDetails(prev => ({
            ...prev,
            storeAddress: address,
            storeLocation: { lat, lng }
          }));
          setErrors(prev => ({ ...prev, storeLocation: undefined }));
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          toast.error("Could not get address details for this location");
        });
    },
  });

  return null;
};

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


  const handleYesShop = (value) => {
    setIsShopYes(value);
  };

  const handleLocationClick = () => {
    setShowMap((prev) => !prev);
  };
  const [uploadImage] = useUploadImageMutation();

  const handleImageChange = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  // Validate file
  if (selectedFile.size > 1024 * 1024) {
    toast.error("File size should not exceed 1 MB!");
    return;
  }

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
  
  if (!validExtensions.includes(fileExtension)) {
    toast.error("Only .jpg, .jpeg, .png, .webp formats are allowed.");
    return;
  }

  try {
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target.result);
    reader.readAsDataURL(selectedFile);

    // Upload to server
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    const response = await uploadImage({
      data: formData,
      itemUid: null
    });

    if (response?.data) {
      const { fileUrl } = response.data.data;
      setShopDetails(prev => ({
        ...prev,
        profile_url: fileUrl
      }));
      toast.success("Image uploaded successfully!");
    } else {
      throw new Error(response.error?.data?.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(error.message || "Image upload failed");
    setSelectedImage(null);
  }
};

  return (
    <div className="location-verification-container">
      <div className="location-verification-card">
        <FormHeader formName="Create Your Shop" />
        <div className="location-map-div">
          {showMap && (
            <div className="map-comp">
              <MapContainer
                center={[20.5937, 78.9629]} // Center on India
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  setShopDetails={setShopDetails}
                  setErrors={setErrors}
                />
              </MapContainer>
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

          <img src={shopDetails?.profile_url} className="shop-profile-pic" />
          <input
            type="file"
            name=""
            id=""
            onChange={(e) => handleImageChange(e, "THUMBNAILS")}
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