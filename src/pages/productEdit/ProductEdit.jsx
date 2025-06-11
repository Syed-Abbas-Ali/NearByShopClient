import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useUploadImageMutation } from "../../apis&state/apis/global";
import { useGetAllCategoriesAndSubCategoriesQuery } from "../../apis&state/apis/masterDataApis";
import {
  useAddSellerProductApiMutation,
  useGetSingleSellerProductsApiQuery,
  useUpdateSellerProductApiMutation,
} from "../../apis&state/apis/shopApiSlice";
import backIcon from "../../assets/arrowLeftLarge.svg";
import cancelIcon from "../../assets/cancelIconRed.svg";
import productUpload from "../../assets/productUpload.svg";
import uploadDefaultImage from "../../assets/uploadDefaultImage.svg";
import Selector from "../../components/selector/Selector";
import SocketContext from "../../context/socketContext.js";
import { accessTokenValue } from "../../utils/authenticationToken";
import { productValidationSchema } from "../../utils/validations.js";
import "./productEdit.scss";

const allCategories = [
  {
    label: "Groceries",
    value: "groceries",
  },
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Footwear",
    value: "footwear",
  },
];

const childImagesList = [
  {
    id: 1,
    imageUrl: "",
  },
  {
    id: 2,
    imageUrl: "",
  },
  {
    id: 3,
    imageUrl: "",
  },
  {
    id: 4,
    imageUrl: "",
  },
];

const ProductEdit = () => {
  const value = useParams();
  const navigate = useNavigate();
  const socketMethods = useContext(SocketContext);
  

  const [errors, setErrors] = useState({});

  const [base64String, setBase64String] = useState(null);
  const childImageRef = useRef([]);

  const [childImages, setChildImages] = useState(childImagesList);
  const [itemUid, setItemUid] = useState(null);

  const [productImageDetails, setProductImageDetails] = useState({});

  const [uploadImage] = useUploadImageMutation();

  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    subCategory: "",
  });

  const token = accessTokenValue();
  const decodedToken = jwtDecode(token);

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

  useEffect(() => {
    const handleConnectionPort = () => {
      socketMethods.emit("connect_socket", {
        userId: decodedToken?.userId || "",
        roomId: null,
      });
    };

    if (socketMethods) {
      handleConnectionPort();
    }
  }, [socketMethods]);

  useEffect(() => {
    if (categoryData?.categoryName) {
      const subCategoryDataList = categories?.data?.find(
        (category) => category.name === categoryData.categoryName
      );

      const allSubCategoriesList = subCategoryDataList?.subcategories?.map(
        (subCategory) => ({
          value: subCategory._id,
          label: subCategory.name,
        })
      );
      setSubCategories(allSubCategoriesList);
    }
  }, [categoryData]);

  const [updateProduct] = useUpdateSellerProductApiMutation();

  const productUidValue =
    value?.shopUid.split("&")[1] !== "add_product"
      ? value?.shopUid.split("&")[1]
      : null;
  const shopUidValue = value?.shopUid.split("&")[0] || null;

  const {
    data: editProductDetails,
    isLoading: editProductLoading,
    isError: editProductError,
  } = useGetSingleSellerProductsApiQuery(
    {
      shopUid: shopUidValue,
      productUid: productUidValue,
    },
    {
      skip: !shopUidValue || !productUidValue,
    }
  );

  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    market_price: "",
    our_price: "",
    isAvailable: "",
  });

  useEffect(() => {
    if (editProductDetails?.data) {
      const product = editProductDetails.data;
      const editableProductData = {
        title: product?.title,
        description: product?.description,
        image: product?.image,
        market_price: product?.market_price,
        our_price: product?.our_price,
        category: product?.category,
        subCategory: product?.subCategory,
        isAvailable: product?.isAvailable,
        productType: product?.productType,
        image: product?.image,
        file_uid: product?.fileUid,
      };
      setProductDetails(editableProductData);
      setProductImageDetails({
        file_uid: product.fileUid,
        image: product.image,
      });
      if (product?.previweImages) {
        const dummyPreviewData = [...childImages];
        product?.previweImages.forEach((item, index) => {
          dummyPreviewData[index].imageUrl = item.fileUrl;
        });
        setChildImages(dummyPreviewData);
      }
    }
  }, [editProductDetails]);

  const [addSingleSellerProduct, { isLoading, isError }] =
    useAddSellerProductApiMutation();

  const imageRef = useRef();

  const handleBack = () => {
    navigate(-1);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64String(reader.result);
        setProductDetails((prev) => ({
          ...prev,
          image: reader.result,
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

  const handleCategoryDropdown = (data) => {
    const { label, value } = data;
    setProductDetails((prev) => {
      return { ...prev, category: label };
    });
  };

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
            const { fileUrl, file_uid } = response.data.data;
            setProductImageDetails({
              file_uid,
              image: fileUrl,
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

  const handleInput = async (e) => {
    const { value, name } = e.target;
    let NumberRequire = ["our_price", "market_price"];
    const finalValue =
      e.target.type === "checkbox"
        ? e.target.checked
        : NumberRequire.includes(name)
        ? Number(value)
        : value;
    setProductDetails((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    try {
      await productValidationSchema.validateAt(name, {
        [name]: finalValue,
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

  const handleUpdate = async () => {
    const { market_price, our_price } = productDetails;
    let data = {
      ...productDetails,
      market_price: Number(market_price),
      our_price: Number(our_price),
      category: productDetails.category,
      subCategory: productDetails.subCategory,
    };
    try {
      await productValidationSchema.validate(data, { abortEarly: false });
      const response = await updateProduct({
        shopUid: value?.shopUid.split("&")[0],
        productUid: productUidValue,
        data,
      });
      if (response?.data) {
        toast.success("Product updated!");
        setTimeout(() => {
          navigate("/profile"); // use navigate from useNavigate()
        }, 1000);
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


  const handleSave = async () => {
    const { market_price, our_price } = productDetails;
    let data = {
      ...productDetails,
      market_price: Number(market_price),
      our_price: Number(our_price),
      
      category: categoryData.categoryName,
      subCategory: categoryData.subCategory,
      ...productImageDetails,
    };
    try {
      await productValidationSchema.validate(data, { abortEarly: false });
      const response = await addSingleSellerProduct({
        shopUid: value?.shopUid.split("&")[0],
        data,
      });
      if (response?.data) {
        toast.success("Product added!");
        // socketMethods.emit("send_notification", {
        //   roomId: null,
        //   ...response.data?.data,
        // });
        navigate(
          `/product-edit/${value?.shopUid.split("&")[0]}&${
            response?.data?.data?.messageData?.item_uid
          }`
        );
      } else { 
        toast.error(response?.error?.data?.errors[0]?.message);
        console.log(response?.error?.data?.errors[0]?.message);
        if (response?.error?.status == 422) {
          navigate(`/seller-plan-purchase/${value?.shopUid.split("&")[0]}`);
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

  const handleMainImageDelete = () => {
    setProductDetails((prev) => ({ ...prev, image: "" }));
  };

  const handleCategory = (data) => {
    const { label, value } = data;
    setCategoryData((prev) => {
      return { ...prev, categoryName: label };
    });
  };
  const handleSubCategory = (data) => {
    const { label, value } = data;
    setCategoryData((prev) => {
      return { ...prev, subCategory: label };
    });
  };

  const triggerFileInput = (index) => {
    childImageRef.current[index].click();
  };

  const handleChildImageChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const newChildImages = childImages.map((img) =>
        img.id === id ? { ...img, imageUrl: URL.createObjectURL(file) } : img
      );
      setChildImages(newChildImages);
      handleImageChange(e, "THUMBNAILS");
    }
  };

  return (
    <>
      <div className="edit-heading">
        <img src={backIcon} alt="" onClick={handleBack} />
        <h3>Upload Product</h3>
      </div>
      <div className="product-edit-card">
        <div className="upload-image-card">
          <div className="upload-input-card" onClick={handleImageUpload}>
            {productImageDetails?.image && (
              <img
                src={cancelIcon}
                alt=""
                onClick={handleMainImageDelete}
                className="cancel-icon"
              />
            )}
            {productImageDetails?.image ? (
              <>
                <img
                  className="main-product-image"
                  src={productImageDetails?.image}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => handleImageChange(e, "OTHER")}
                  style={{ display: "none" }}
                />
              </>
            ) : (
              <div className="pre-upload">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => handleImageChange(e, "OTHER")}
                  style={{ display: "none" }}
                />
                <img src={productUpload} alt="upload" />
                <button>Upload Image</button>
              </div>
            )}
          </div>

          <div className="sub-images">
            {value?.shopUid.split("&")[1]?.length > 11 &&
              childImages.map((item, index) => {
                return (
                  <div className="image-div">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (childImageRef.current[index] = el)}
                      onChange={(e) => handleChildImageChange(e, item.id)}
                      style={{ display: "none" }}
                    />
                    <img
                      onClick={() => triggerFileInput(index)}
                      src={item.imageUrl || uploadDefaultImage}
                      alt="upload-default"
                      key={index}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="text-form">
          <div className="product-names-card">
            <div className="text-form-card">
              <label>Product Name</label>
              <textarea
                placeholder="Enter your Product Name"
                rows="5"
                name="title"
                value={productDetails.title}
                onChange={handleInput}
              ></textarea>
              {errors.title && <p className="error">{errors.title}</p>}
            </div>
            <div className="text-form-card">
              <label>Product Description</label>
              <textarea
                placeholder="Enter your Product Description"
                rows="5"
                name="description"
                value={productDetails.description}
                onChange={handleInput}
              ></textarea>
              {errors.description && (
                <p className="error">{errors.description}</p>
              )}
            </div>
          </div>
          <div className="products-stock">
            <div className="stock-check-box">
              <input
                type="checkbox"
                id="available"
                name="isAvailable"
                checked={productDetails.isAvailable ?? 0}
                onChange={handleInput}
              />
              <label htmlFor="available">Are products available?</label>
              {errors.isAvailable && (
                <p className="error">{errors.isAvailable}</p>
              )}
            </div>
          </div>
          <div className="double-input-card">
            <div>
              <label>Market Price</label>
              <input
                type="text"
                placeholder="example 3000"
                name="market_price"
                value={productDetails.market_price ?? 0}
                onChange={handleInput}
              />
              {errors.market_price && <p className="error">{errors.market_price}</p>}
            </div>
            <div>
              <label>Your Price</label>
              <input
                type="text"
                placeholder="example 2000"
                name="our_price"
                value={productDetails.our_price ?? 0}
                onChange={handleInput}
              />
              {errors.our_price && (
                <p className="error">{errors.our_price}</p>
              )}
            </div>
          </div>
          <div className="product-categories">
            <div className="select-card-div">
              <label>Category</label>
              <Selector
                onSelectDropdown={handleCategory}
                dropdownList={categoriesList}
                placeholderText={productDetails?.category ?? "Select Category"}
              />
              {errors.category && <p className="error">{errors.category}</p>}
            </div>
            <div className="select-card-div">
              <label>Sub Category</label>
              <Selector
                onSelectDropdown={handleSubCategory}
                dropdownList={subCategories}
                placeholderText={productDetails?.subCategory}
              />
              {errors.subCategory && (
                <p className="error">{errors.subCategory}</p>
              )}
            </div>
          </div>
          <div className="radio-buttons-card">
            <h3>Product Type</h3>
            <div className="radio-buttons">
              <div>
                <input
                  type="radio"
                  name="productType"
                  value={"NEW"}
                  onChange={handleInput}
                  checked={productDetails?.productType == "NEW"}
                />
                <label>New</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="productType"
                  value={"REFURBISH"}
                  onChange={handleInput}
                  checked={productDetails?.productType == "REFURBISH"}
                />
                <label>Refurbish (Second hand) </label>
              </div>
            </div>
            {errors.productType && (
              <p className="error">{errors.productType}</p>
            )}
          </div>
          <div className="action-buttons">
            {!productUidValue ? (
              <button onClick={handleSave}>Save</button>
            ) : (
              <button onClick={handleUpdate}>Update</button>
            )}
            <button>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductEdit;
