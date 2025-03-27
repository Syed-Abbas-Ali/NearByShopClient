import React from "react";

// Lazy load routes
export const HomePage = React.lazy(() => import("../pages/home/Home"));
export const SubCategoryProductsPage = React.lazy(() =>
  import("../pages/subCategoryProducts/SubCategoryProducts")
);
export const SubHomePage = React.lazy(() => import("../pages/subHome/SubHome"));
export const SubCategoriesPage = React.lazy(() =>
  import("../pages/subCategories/SubCategories")
);
export const WishlistPage = React.lazy(() =>
  import("../pages/wishlist/Wishlist")
);
export const OfferPage = React.lazy(() => import("../pages/offer/Offer"));
export const OfferEditPage = React.lazy(() =>
  import("../pages/offerEdit/OfferEdit")
);
export const ChatPage = React.lazy(() => import("../components/navbar1/components/chat/Chat"));
export const ChatDetailsPage = React.lazy(() =>
  import("../components/navbar1/components/chatDetails/ChatDetails")
);
export const OfferSubCategoryPage = React.lazy(() =>
  import("../pages/offersSubCategory/OfferSubCategory")
);
export const OfferSubCategoryProductsPage = React.lazy(() =>
  import("../pages/offer/offerSubCategoryProducts/OfferSubCategoryProducts")
);
export const OfferSubCategoryListPage = React.lazy(() =>
  import("../pages/offerSubCategoryList/OfferSubCategoryList")
);
export const SellerProfileEditPage = React.lazy(() =>
  import("../pages/sellerProfileEdit/SellerProfileEdit")
);
export const SignUpPage = React.lazy(() =>
  import("../pages/userAuthentication/signUp/Signup")
);
export const LoginPage = React.lazy(() =>
  import("../pages/userAuthentication/login/Login")
);
export const ForgotPasswordPage = React.lazy(() =>
  import("../pages/userAuthentication/forgotPassword/ForgotPassword")
);
export const OtpPage = React.lazy(() =>
  import("../pages/userAuthentication/otp/Otp")
);
export const ChangePasswordPage = React.lazy(() =>
  import("../pages/userAuthentication/changePassword/ChangePassword")
);
export const UpdatePasswordPage = React.lazy(() =>
  import("../pages/userAuthentication/updatePassowrd/UpdatePassword")
);
export const AadharVerificationPage = React.lazy(() =>
  import("../pages/aadharVerification/AadharVerification")
);
export const LocationVerificationPage = React.lazy(() =>
  import("../pages/locationVerification/LocationVerification")
);
export const CurrentBillVerificationPage = React.lazy(() =>
  import("../pages/currentbillVerification/CurrentbillVerification")
);
export const ThankyouPage = React.lazy(() =>
  import("../pages/thankyou/Thankyou")
);
export const WebsiteFormPage = React.lazy(() =>
  import("../pages/websiteForm/WebsiteForm")
);
export const NotificationsPage = React.lazy(() =>
  import("../pages/notifications/Notifications")
);
export const ProductDetailsPage = React.lazy(() =>
  import("../pages/productDetails/ProductDetails")
);
export const ProductEditPage = React.lazy(() =>
  import("../pages/productEdit/ProductEdit")
);
export const UserProfileDetailsPage = React.lazy(() =>
  import("../pages/userProfileDetails/UserProfileDetails")
);
export const ShopPage = React.lazy(() => import("../pages/shop/Shop"));
export const PlanPurchasePage = React.lazy(() =>
  import("../pages/planPurchase/PlanPurchase")
);
export const FullShopsPage = React.lazy(() =>
  import("../pages/fullShops/FullShops")
);
export const ShopVerificationPage = React.lazy(() =>
  import("../pages/shopVerification/ShopVerification")
);
export const ShopProfileViewPage = React.lazy(() =>
  import("../pages/shopProfileView/ShopProfileView")
);
export const SettingsPage = React.lazy(() =>
  import("../pages/settings/Settings")
);
