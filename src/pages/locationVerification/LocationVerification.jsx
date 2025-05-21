// LocationVerification.js
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateShopMutation } from "../../apis&state/apis/shopApiSlice";
import sellerSelectMap from "../../assets/sellerSelectMap.png";
import FormHeader from "../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";
import Input from "../../components/input/Input";
import "./locationVerification.scss";
import CustomMapComponent from "../../components/mapComponent/CustomMapComponent";
import {
  locationDetailsValidationSchema,
  shopValidationSchema,
} from "../../utils/validations";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import Selector from "../../components/selector/Selector";

const locationFields = [
  {
    label: "Shop name",
    name: "shopName",
    placeholderText: "Enter your Shop Name",
  },
  {
    label: "Shop location address",
    name: "storeAddress",
    placeholderText: "Enter shop location address",
  },
  {
    label: "Shop category",
    name: "category",
    placeholderText: "Enter shop category",
  },
  {
    label: "Shop Description",
    name: "storeDescription",
    placeholderText: "Enter shop description",
  },
  // {
  //   label: "Shop email",
  //   name: "shopEmail",
  //   placeholderText: "Enter shop email",
  // },
  // {
  //   label: "State",
  //   name: "state",
  //   placeholderText: "Enter your state",
  // },
  // {
  //   label: "City",
  //   name: "city",
  //   placeholderText: "Enter your city",
  // },
];

const LocationVerification = () => {
  const value = useSelector((state) => state.shopVerificationState);
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [error, setError] = useState(null);
  const [isShopYes, setIsShopYes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  const [createNewShop] = useCreateShopMutation();

  const [shopDetails, setShopDetails] = useState({
    locationAddress: "",
    shopName: "",
    category: "",
    // contactInfoPhone: "",
    // contactInfoEmail: "",
    // shopWebsite: "",
    // xLink: "",
    // instagramLink: "",
    shopDescription: "",
    // shopEmail: "",
    // state: "",
    // city: "",
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
    const { label, value } = data;
    setShopDetails((prev) => {
      return { ...prev, category: label };
    });
  };
  const handleInput = async (inputObject) => {
    const { name, value } = inputObject.target;
    setShopDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    try {
      await shopValidationSchema.validateAt(name, { [name]: value });
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

  useEffect(() => {
    const getUserLocation = () => {
      setLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            setLoading(false);
          },
          (error) => {
            setError("Unable to retrieve location");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  const handleSubmit = async () => {
    const shopFinalData = {
      storeName: shopDetails.shopName,
      category: shopDetails.category,
      storeDescription: shopDetails.storeDescription,
      email: shopDetails.shopEmail,
      state: shopDetails.state,
      city: shopDetails.city,
      storeLocation: shopDetails?.storeLocation,
      storeAddress: shopDetails?.storeAddress,
    };
    try {
      await shopValidationSchema.validate(shopFinalData, { abortEarly: false });
      const response = await createNewShop(shopFinalData);
      if (response?.data) {
        toast.success("Store Created Successfully!");
        sessionStorage.setItem("user", JSON.stringify(response?.data.data));
        navigate(-1);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors); // Set validation errors to state
      }
    }
  };

  const handleYesShop = (value) => {
    setIsShopYes(value);
  };

  const handleLocationClick = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <div className="location-verification-container">
      <div className="location-verification-card">
        <FormHeader formName="Create Your Shop" />
        <div className="location-map-div">
          {showMap && (
            <div className="map-comp">
              <CustomMapComponent
                handleSetLocationDetails={({ storeAddress }) => {
                  setShopDetails((prev) => ({ ...prev, ...storeAddress }));
                }}
              />
            </div>
          )}
          <div className="select-location-sample-card">
            <img src={sellerSelectMap} />
            {/* {shopAddressValue && <h3>{shopAddressValue}</h3>} */}
            <button
              className="select-location-text-btn"
              onClick={handleLocationClick}
            >
              {/* {shopAddressValue
                ? "Change Shop Location" */}
              "Select Shop Location"
            </button>
          </div>
          {errors.storeLocation && (
            <p className="form-error-message">{errors?.storeLocation}ggg</p>
          )}
        </div>
        <div className="fields-card">
          <div className="fields-container">
            {locationFields.map((item, index) => (
              <div key={index} className="input-single-card">
                <label>{item.label}</label>
                {
                  item?.name=="category"? <Selector
                onSelectDropdown={handleCategory}
                dropdownList={categoriesList}
                placeholderText={"Select Category"}
              />:<Input
                  initialData={item}
                  handleInput={handleInput}
                  value={shopDetails[item.name]}
                />
                }
                {item.name in errors && (
                  <p className="form-error-message">{errors[item.name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="action-card">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationVerification;
