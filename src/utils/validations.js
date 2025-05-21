import * as Yup from "yup";

// Validation schema using Yup
export const signupValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .required("Phone Number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
  termsAndCondition: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),
});

export const forgetPasswordValidationSchema = Yup.object({
  email: Yup.string().required("Email is required"),
});

export const changePasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string().required("Password is required"),
});

export const updatePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .min(6, "Old Password must be at least 6 characters long")
    .required("Old Password is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string().required("Password is required"),
});

export const locationDetailsValidationSchema = Yup.object().shape({
  locationAddress: Yup.string()
    .required("Shop location address is required")
    .min(10, "Location address must be at least 10 characters")
    .max(500, "Location address can't be more than 500 characters"),

  shopName: Yup.string()
    .required("Shop name is required")
    .min(2, "Shop name must be at least 2 characters")
    .max(100, "Shop address can't be more than 100 characters"),
});

export const shopVerificationValidationSchema = Yup.object().shape({
  aadharNumber: Yup.string()
    .required("Aadhaar number is required")
    .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
  aadharNumberImage: Yup.string().required("Current Bill Image is required"),
  gstNumber: Yup.string()
    .required("GST number is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "GST number must be in a valid format"
    ),
  currentBillImage: Yup.string().required("Current Bill Image is required"),
});

export const userProfileEditValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

export const ProductAddAndEditValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Title cannot exceed 1000 characters"),

  image: Yup.string().required("Image is required"),

  mainPrice: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),

  discountPercentage: Yup.number()
    .required("Discount percentage is required")
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100"),

  category: Yup.string()
    .required("Category is required")
    .min(1, "Category must be at least 3 characters long")
    .max(50, "Category cannot exceed 50 characters"),

  stock: Yup.number()
    .required("Stock quantity is required")
    .min(0, "Stock quantity cannot be negative")
    .integer("Stock must be an integer"),

  isAvailable: Yup.boolean()
    .required("Availability is required")
    .oneOf([true, false], "Availability must be true or false"),
});

export const productValidationSchema = Yup.object().shape({
  title: Yup.string().required("Product title is required"),
  description: Yup.string().required("Description is required"),
  mainPrice: Yup.number()
    .typeError("Main price must be a number")
    .positive("Price must be positive")
    .required("Main price is required"),
  discountPrice: Yup.number()
    .typeError("Discount price must be a number")
    .min(0, "Discount price must be at least 0"),
  // stock: Yup.number()
  //   .typeError("Stock must be a number")
  //   .integer("Stock must be an integer")
  //   .min(0, "Stock cannot be negative")
  //   .required("Stock is required"),
  isAvailable: Yup.boolean(),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("Subcategory is required"),
  productType: Yup.string().required("productType is required"),
});

export const shopValidationSchema = Yup.object().shape({
  storeName: Yup.string()
    .trim()
    .min(3, "Shop name must be at least 3 characters")
    .max(50, "Shop name must be at most 50 characters")
    .required("Shop name is required"),

  storeAddress: Yup.string()
    .trim()
    .min(5, "Store address must be at least 5 characters")
    .required("Store address is required"),

  category: Yup.string()
    .trim()
    .min(3, "Category must be at least 3 characters")
    .max(30, "Category must be at most 30 characters")
    .required("Shop category is required"),

  storeDescription: Yup.string()
    .trim()
    .min(10, "Shop description must be at least 10 characters")
    .required("Shop description is required"),

  // email: Yup.string()
  //   .trim()
  //   .email("Invalid email format")
  //   .required("Shop email is required"),

  // state: Yup.string()
  //   .trim()
  //   .min(2, "State must be at least 2 characters")
  //   .max(50, "State must be at most 50 characters")
  //   .required("State is required"),

  // city: Yup.string()
  //   .trim()
  //   .min(2, "City must be at least 2 characters")
  //   .max(50, "City must be at most 50 characters")
  //   .required("City is required"),

  storeLocation: Yup.object()
    .required("Store location is required") // Ensure the whole object is required
    .test(
      "is-not-empty",
      "Store location is required",
      (value) => !!value && Object.keys(value).length > 0
    ),
});

export const discountValidationSchema = Yup.object().shape({
  amount: Yup.number().positive().integer().required("Amount is required"),
  currency: Yup.string()
    .matches(/^(INR|USD|EUR|GBP)$/, "Invalid currency")
    .required("Currency is required"),
  receipt: Yup.string().required("Receipt is required"),
  paymentFor: Yup.string()
    .oneOf(["discount", "offer", "deal"], "Invalid payment type")
    .required("PaymentFor is required"),
  deal: Yup.string().required("Deal date is required"),
  StartDate: Yup.date().required("Start date is required"),
  EndDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("StartDate"), "End date must be after start date"),
  categoryId: Yup.string().required("Category ID is required"),
  subCategory: Yup.string().required("Sub-category name is required"),
  textColor: Yup.string()
    .matches(/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/, "Invalid RGB color format")
    .required("Text color is required"),
  backgroundColor: Yup.string().required("Background color is required"),
});
