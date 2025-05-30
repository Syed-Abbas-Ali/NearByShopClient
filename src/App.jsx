import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// Assets
import chatbotIcon from "./assets/chatbotIcon.svg";

import ChatComponent from "./pages/chat/ChatComponent";

// Lazy-loaded Pages
import {
  HomePage,
  OfferPage,
  ProductDetailsPage,
  WishlistPage,
  ProductEditPage,
  WebsiteFormPage,
  NotificationsPage,
  SignUpPage,
  LoginPage,
  ForgotPasswordPage,
  ChangePasswordPage,
  OtpPage,
  AadharVerificationPage,
  LocationVerificationPage,
  ThankyouPage,
  CurrentBillVerificationPage,
  OfferEditPage,
  OfferSubCategoryPage,
  OfferSubCategoryListPage,
  ChatPage,
  ChatDetailsPage,
  SubCategoriesPage,
  SellerProfileEditPage,
  UpdatePasswordPage,
  SubHomePage,
  UserProfileDetailsPage,
  ShopPage,
  FullShopsPage,
  PlanPurchasePage,
  ShopVerificationPage,
  ShopProfileViewPage,
  OfferSubCategoryProductsPage,
  SubCategoryProductsPage,
  SettingsPage,
} from "./lazyPages/LazyPages";

// Styles
import "./app.scss";
import Fallback from "./components/fallback/Fallback";
import { Toaster } from "react-hot-toast";
import SearchComponent from "./components/commonComponents/searchComponent/SearchComponent";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatbotOpen } from "./apis&state/state/globalStateName";
import Chatbot from "./components/commonComponents/chatbot/Chatbot";
import PlanPurchase from "./pages/planPurchase/PlanPurchase";
import NotFound from "./pages/notFound/NotFound";
import UserLocationSelect from "./components/commonComponents/userLocationSelect/UserLocationSelect";
import GlobalFilters from "./components/commonComponents/globalFilters/GlobalFilters";
import UserLocationDetails from "./components/commonComponents/userLocationDetails/UserLocationDetails";
import UserLocationMapComponent from "./components/commonComponents/userLocationMapComponent/UserLocationMapComponent";
import socket from "./utils/socketIo";
import { accessTokenValue } from "./utils/authenticationToken";
import { jwtDecode } from "jwt-decode";
import AuthenticationRoutes from "./protectedRoutes/AuthenticationRoutes";
import ProtectedRoute from "./protectedRoutes/ProtectedRoutes";
import { setRoomChat } from "./apis&state/state/chatState";

const needNotChatBot = [
  "/signup",
  "/login",
  "/forgot-password",
  "/change-password",
  "/update-password",
  "/otp",
  "/thankyou",
];

const protectionPages = [
  { path: "/sub-home", element: <SubHomePage /> },
  { path: "/sub-categories", element: <SubCategoriesPage /> },
  { path: "/offer", element: <OfferPage /> },
  { path: "/offer-edit/:shopUid/:offerUid", element: <OfferEditPage /> },
  {
    path: "/offer-sub-category/:categoryName",
    element: <OfferSubCategoryPage />,
  },
  { path: "/offer-products", element: <OfferSubCategoryProductsPage /> },
  { path: "/offer-sub-category-list", element: <OfferSubCategoryListPage /> },
  { path: "/wishlist", element: <WishlistPage /> },

  // { path: "/shop", element: <ShopPage /> },


  { path: "/shop/:shopCategory?", element: <ShopPage /> },

  { path: "/all-shops", element: <FullShopsPage /> },
  { path: "/product-edit/:shopUid", element: <ProductEditPage /> },
  { path: "/seller-profile-edit/:shopUid", element: <SellerProfileEditPage /> },
  { path: "/seller-plan-purchase/:shopUid?", element: <PlanPurchasePage /> },
  { path: "/profile", element: <UserProfileDetailsPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/chat", element: <ChatComponent /> },
  { path: "/chat-details", element: <ChatDetailsPage /> },
  { path: "/shop-profile-view/:shopId", element: <ShopProfileViewPage /> },
  { path: "/settings", element: <SettingsPage /> },
  {
    path: "/aadhar-verification/:shopUid",
    element: <AadharVerificationPage />,
  },
  { path: "/location-verification", element: <LocationVerificationPage /> },
  {
    path: "/currentbill-verification/:shopUid",
    element: <CurrentBillVerificationPage />,
  },
  { path: "/shop-verification/:shopUid", element: <ShopVerificationPage /> },
];

const nonProtectionPages = [
  { path: "/product-details/:productUid", element: <ProductDetailsPage /> },
  {
    path: "/sub-category-page/:categoryName",
    element: <SubCategoryProductsPage />,
  },
  { path: "/", element: <HomePage /> },
  { path: "/website-form", element: <WebsiteFormPage /> },
  { path: "/thankyou", element: <ThankyouPage /> },
  { path: "*", element: <NotFound /> },
];
const authenticationPages = [
  { path: "/signup", element: <SignUpPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/change-password", element: <ChangePasswordPage /> },
  { path: "/update-password", element: <UpdatePasswordPage /> },
  { path: "/otp", element: <OtpPage /> },
];
const App = () => {
  const dispatch = useDispatch();
  const { isChatbotOpen, isFilterPopupOpen } = useSelector(
    (state) => state.globalState
  );

  const { isUserMapLocationOpen } = useSelector(
    (state) => state.mapDetailsState
  );
  const { roomId, isChatActive } = useSelector((state) => state.chatState);

  useEffect(() => {
    const handleConnectionPort = () => {
      const token = accessTokenValue();
      if (!token) {
        return null;
      }
      const decodedToken = jwtDecode(token);

      socket.emit("connect_socket", {
        userId: decodedToken?.userId || "",
        roomId: roomId ?? "",
      });
    };

    if (socket) {
      handleConnectionPort();
    }
  }, [socket, roomId]);

  useEffect(() => {
    clearInterval();
    setTimeout(() => {
      if (!isChatActive) {
        dispatch(setRoomChat(null));
      }
    }, 500);
  }, [isChatActive]);

  const handleChatbotClick = () => {
    dispatch(setIsChatbotOpen());
  };
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{ zIndex: 99999999999999 }}
      />
      {/* {isFilterPopupOpen && <GlobalFilters />} */}
      {/* {isUserMapOpen && <UserLocationSelect />} */}
      {/* {isUserMapLocationOpen && <UserLocationMapComponent />} */}
      {isUserMapLocationOpen && <UserLocationSelect />}
      <Suspense fallback={<Fallback />}>
        <div className="app-container">
          {/* <SearchComponent/> */}
          <UserLocationDetails />

          {/* {isChatbotOpen && <Chatbot />}
          {!isChatbotOpen && !needNotChatBot.includes(pathname) && (
            <div className="chatbot-icon" onClick={handleChatbotClick}>
              <img src={chatbotIcon} alt="" />
            </div>
          )} */}
          <Routes>
            {/* Authentication Pages */}
            <Route element={<AuthenticationRoutes />}>
              {authenticationPages.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* Protected Pages */}
            <Route element={<ProtectedRoute />}>
              {protectionPages.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* Non-Protection Pages */}
            {nonProtectionPages.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
      </Suspense>
    </>
  );
};

export default App;
