  import React, { useEffect, useRef, useState } from "react";
  import "./offerEdit.scss";
  import WrapperComponent from "../../components/wrapperComponent/WrapperComponent";
  import OfferHeader from "../offer/offerHeader/OfferHeader";
  import discountEditIcon from "../../assets/discountEditIcon.svg";
  import OfferForm from "./offerForm/OfferForm";
  import backIcon from "../../assets/arrowLeftLarge.svg";
  import {
    useCreatePlanOrderMutation,
    useGetSingleShopsApiQuery,
  } from "../../apis&state/apis/shopApiSlice";
  import { useNavigate, useParams } from "react-router-dom";
  import uploadDefaultImage from "../../assets/uploadDefaultImage.svg";
  import {
    useGetSingleDiscountQuery,
    useUpdateDiscountMutation,
  } from "../../apis&state/apis/discounts";
  import toast from "react-hot-toast";
  import editIconWhiteV1 from "../../assets/editIconWhiteV1.svg";
  import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
  import DropdownMenu from "../../components/commonComponents/dropdownMenu/DropdownMenu";
  import DatePicker from "../../components/commonComponents/datePicker/DatePicker";
  import DatePickerComponent from "../../components/commonComponents/datePicker/DatePicker";
  import ColorPickerComponent from "../../components/commonComponents/colorPicker/ColorPicker";
  import { useUploadImageMutation } from "../../apis&state/apis/global";
  import { discountValidationSchema } from "../../utils/validations";

  const defaultDiscountData = {
    amount: 5000,
    currency: "INR",
    receipt: "receipt#1",
    paymentFor: "discount",
    offer: "",
  };

  const OfferEdit = () => {
    const [datesObject, setDatesObject] = useState({
      startDate: "",
      endDate: "",
    });
    const [colorsObject, setColorsObject] = useState({
      textColor: "#fff",
      backgroundColor:
        "linear-gradient(90deg, rgb(149,221,193) 0%, rgb(14,104,167) 100%)",
    });
    const { shopUid, offerUid } = useParams();
    const navigate = useNavigate();
    const shopUidValue = shopUid;
    const [cardBgColor, setCardBgColor] = useState("#ffffff");
    const imageRef = useRef();
    const [base64String, setBase64String] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const { data: categories } = useGetAllCategoriesAndSubCategoriesQuery();
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [totalPayment, setTotalPayment] = useState("");
    const [errors, setErrors] = useState({});

    const [uploadImage] = useUploadImageMutation();
    const [categoryData, setCategoryData] = useState({
      categoryName: "",
      categoryId: "",
      subCategory: "",
    });
    const [productImageDetails, setProductImageDetails] = useState({});

    const { data: singleShopDetails } = useGetSingleShopsApiQuery(shopUid, {
      skip: !shopUid,
    });

    const { data: singleDiscountData } = useGetSingleDiscountQuery(offerUid, {
      skip: !offerUid || offerUid === "discountId",
    });

    const [createOrder] = useCreatePlanOrderMutation();
    const [updateDiscount] = useUpdateDiscountMutation();
    const [productDetails, setProductDetails] = useState({
      ...defaultDiscountData,
    });

    useEffect(() => {
      if (singleDiscountData?.data) {
        const startDateValue =
          singleDiscountData?.data.StartDate?.split("T")[0] || "";
        const endDateValue =
          singleDiscountData?.data.EndDate?.split("T")[0] || "";
        if (startDateValue && endDateValue) {
          setDatesObject((prev) => ({
            ...prev,
            startDate: startDateValue,
            endDate: endDateValue,
          }));
        }
        setProductDetails((prev) => ({
          ...prev,
          offer: singleDiscountData.data.offer,
        }));
        setProductImageDetails({
          imageUrl: singleDiscountData.data.imageUrl,
          file_uid: singleDiscountData.data.file_uid,
        });
        setColorsObject((prev) => ({
          ...prev,
          textColor: singleDiscountData.data.textColor,
          backgroundColor: singleDiscountData.data.backgroundColor,
        }));
        setCategoryData((prev) => ({
          ...prev,
          categoryName: singleDiscountData.data.categoryName,
          categoryId: singleDiscountData.data.categoryId,
          subCategory: singleDiscountData.data.subCategory,
        }));
      }
    }, [singleDiscountData]);

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }, []);

    const paymentWindow = (orderResponse) => {
      const options = {
        key: `rzp_test_rs5jkKLF8rjHQd`,
        amount: orderResponse?.amount_due ?? orderResponse?.total_amount,
        currency: orderResponse?.currency ?? "INR",
        name: "Come Fly With Me",
        description: "Transaction",
        order_id: orderResponse?.id ?? orderResponse?.order_id,
        callback_url: "https://www.comeflywithme.co.in/payment-success",
        handler: async function (response) {
          try {
            toast.success("Payment successful!");
            navigate(-1);
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        theme: {
          color: "#151515",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    useEffect(() => {
      if (datesObject.startDate && datesObject.endDate) {
        const startDate = new Date(datesObject.startDate);
        const endDate = new Date(datesObject.endDate);
        const differenceInTime = endDate - startDate;
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
        setTotalPayment(differenceInDays * 40);
      }
    }, [datesObject]);

    const handleCreateOrder = async () => {
      const finalData = {
        ...productDetails,
        ...productImageDetails,
        amount: totalPayment,
        StartDate: datesObject.startDate,
        EndDate: datesObject.endDate,
        categoryId: categoryData.categoryId,
        subCategory: categoryData.subCategory,
        categoryName: categoryData.categoryName,
        ...colorsObject,
      };
      try {
        await discountValidationSchema.validate(finalData, { abortEarly: false });
        const response = await createOrder({
          data: finalData,
          shopUid: shopUidValue,
        });
        if (response?.data) {
          setOrderDetails(response.data);
          if (response?.data) {
            paymentWindow(response?.data?.data);
          }
        }
      } catch (err) {
        if (err.inner) {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        }
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setBase64String(reader.result);
          setProductDetails((prev) => ({
            ...prev,
            imageUrl: reader.result,
          }));
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleImageUpload = () => {
      imageRef.current.click();
    };

    const handleUpdateDiscount = async () => {
      const finalUpdateData = {
        ...singleDiscountData?.data,
        deal: productDetails.deal,
        offer: productDetails.offer,
        categoryName: categoryData.categoryName,
        categoryId: categoryData.categoryId,
        subCategory: categoryData.subCategory,
        ...colorsObject,
        ...productImageDetails,
      };
      try {
        const response = await updateDiscount(finalUpdateData);
        if (response?.data) {
          toast.success("Discount updated!");
          navigate(-1);
        } else {
          toast.error("Something went wrong!");
        }
      } catch (e) {
        console.log(e);
      }
    };

    const handleDates = (dateString, name) => {
      setDatesObject((prev) => ({
        ...prev,
        [name]: dateString,
      }));
    };

    const handleCategoryDropdown = (data) => {
      const { label, value, name = undefined } = data;
      if (name) {
        setCategoryData((prev) => ({
          ...prev,
          categoryId: value,
          categoryName: label,
        }));
      } else {
        setCategoryData((prev) => ({
          ...prev,
          subCategory: label,
        }));
      }
    };

    // ✅ FIXED: Moved out and corrected
    const handleOfferChange = (e) => {
      setProductDetails((prev) => ({ ...prev, offer: e.target.value }));
    };

    const handleDealChange = (e) => {
      setProductDetails((prev) => ({ ...prev, deal: e.target.value }));
    };

    const handleColor = (colorText, name) => {
      setColorsObject((prev) => ({ ...prev, [name]: colorText }));
    };

    const handleBack = () => {
      navigate(-1);
    };

    useEffect(() => {
      if (categories?.data?.length > 0) {
        const allCategoriesList = categories?.data?.map((category) => ({
          key: category.categoryId,
          label: category.name,
        }));
        setCategoriesList(allCategoriesList);
      }
    }, [categories]);

    useEffect(() => {
      if (categoryData?.categoryId) {
        const subCategoryDataList = categories?.data?.find(
          (category) => category.categoryId == categoryData.categoryId
        );
        const allSubCategoriesList = subCategoryDataList?.subcategories?.map(
          (subCategory) => ({
            key: subCategory._id,
            label: subCategory.name,
          })
        );
        setSubCategories(allSubCategoriesList);
      }
    }, [categoryData]);

    useEffect(() => {
      if (singleDiscountData?.data) {
        setProductDetails(singleDiscountData?.data);
      }
    }, [singleDiscountData]);

    const handleChangeDate = (e) => {
      // Incomplete in original, completing below:
      const { name, value } = e.target;
      handleDates(value, name);
    };
    const handleCategory = (data) => {
      handleCategoryDropdown({ ...data, name: "category" });
    };
    const handleSubCategory = (data) => {
      handleCategoryDropdown(data);
    };
    const handleDiscountPercentage = (e) => {
      handleDealChange(e);
      handleOfferChange(e);
    };
    
    const handleImageChange = async (event) => {
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
              type: "OTHER",
            });
            if (response?.data) {
              const { fileUrl, file_uid } = response.data.data;
              setProductImageDetails({
                file_uid,
                imageUrl: fileUrl,
              });
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
    return (
      <div className="offer-edit-page">
        <div className="header-card">
          <button onClick={handleBack}>
            <img src={backIcon} alt="" />
          </button>
          <p>Deals</p>
        </div>
        <div className="offer-edit-content">
          <div className="offer-edit-card">
          <div
            className="offer-image-card"
            style={{ backgroundImage: colorsObject.backgroundColor }}
          >
            <div className="image-default-card">
              <button className="default-image">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => handleImageChange(e, "OTHER")}
                  style={{ display: "none" }}
                />
                <img
                  src={productImageDetails?.imageUrl || uploadDefaultImage}
                  onClick={handleImageUpload}
                  alt=""
                />
              </button>
              <button className="edit-icon">
                <img src={editIconWhiteV1} alt="" />
              </button>
            </div>
            <div className="discount-content">
              <button className="edit-icon">
                <img src={editIconWhiteV1} alt="" />
              </button>
              <div className="first-section">
                <h3
                  className="shop-name"
                  style={{ color: colorsObject.textColor }}
                >
                  {singleShopDetails?.data?.shop_name}
                </h3>
                <p
                  className="location-text"
                  style={{ color: colorsObject.textColor }}
                >
                  {singleShopDetails?.data?.shop_address}
                </p>
              </div>
              <div className="second-section">
               
                <input
                  style={{ color: colorsObject.textColor }}
                
                
                  placeholder="Enter your Offer"
                  onChange={handleDealChange}
                  value={productDetails.deal}
                />
                
                {errors?.deal && (
                  <p className="form-error-message">{errors?.deal}</p>
                )}
              </div>
              <div className="second-section">
                <input
                  style={{ color: colorsObject.textColor }}
                  placeholder="Enter dates of deal"
                  onChange={handleOfferChange}
                  value={productDetails.offer}
                />
                {errors?.offer && (
                  <p className="form-error-message">{errors?.offer}</p>
                )}
              </div>
            </div>
          </div>
          <div className="select-colors-card">
            <div className="select-bg-color">
              <p className="label-text">Select Background Color:</p>
              <ColorPickerComponent
                handleColorPicker={(colorText) =>
                  handleColor(colorText, "backgroundColor")
                }
              />
              {errors?.backgroundColor && (
                <p className="form-error-message">{errors?.backgroundColor}</p>
              )}
            </div>
            <div className="select-bg-color">
              <p className="label-text">Select Text Color:</p>
              <ColorPickerComponent
                isSingle={true}
                handleColorPicker={(colorText) =>
                  handleColor(colorText, "textColor")
                }
              />
              {errors?.textColor && (
                <p className="form-error-message">{errors?.textColor}</p>
              )}
            </div>
          </div>
          </div>
          <div className="input-fields">
            <div className="single-drop-down">
              <span className="label-text">Date</span>
              <div className="date-pickers-card">
                <DatePickerComponent
                  dateValue={datesObject.startDate}
                  placeholder="Start Date"
                  disabled={offerUid != "discountId" ? true : false}
                  handleDate={(dateString) =>
                    handleDates(dateString, "startDate")
                  }
                  error={errors?.StartDate}
                />
                <DatePickerComponent
                  dateValue={datesObject.endDate}
                  placeholder="End Date"
                  disabled={offerUid != "discountId" ? true : false}
                  handleDate={(dateString) => handleDates(dateString, "endDate")}
                  error={errors?.EndDate}
                />
              </div>
            </div>
            <div className="sub-drop-down">
            <div className="single-drop-down">
              <span className="label-text">Category</span>
              <DropdownMenu
                defaultValue={categoryData?.categoryName}
                dataArray={categoriesList}
                handleDropdown={handleCategoryDropdown}
                type="category"
                placeholder={categoryData?.categoryName || "Select category"}
              />
              {errors?.categoryId && (
                <p className="form-error-message">{errors?.categoryId}</p>
              )}
            </div>
            <div className="single-drop-down">
              <span className="label-text">Sub Category</span>
              <DropdownMenu
                defaultValue={categoryData?.subCategory}
                dataArray={subCategories}
                handleDropdown={handleCategoryDropdown}
                type="subCategory"
                placeholder={categoryData?.subCategory || "Select sub category"}
              />
              {errors?.subCategory && (
                <p className="form-error-message">{errors?.subCategory}</p>
              )}
            </div>
          </div>
          <div className="price-details-card">
            </div>
            <div className="price-details-card">
            <div className="amount-text">
              <p>Amount</p>
              <h3>Total Amount ₹{totalPayment}</h3>
              <span>Per day it will cost ₹40</span>
            </div>
            {offerUid == "discountId" ? (
              <div className="pay-btn">
                <button onClick={handleCreateOrder}>Pay</button>
              </div>
            ) : (
              <div className="pay-btn">
                <button onClick={handleUpdateDiscount}>Update</button>
              </div>
            )}
          </div>
          </div>
          
        </div>
      </div>
    );
  };

  export default OfferEdit;