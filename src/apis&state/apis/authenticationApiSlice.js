// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessTokenValue } from "../../utils/authenticationToken";

export const authenticationApiSlice = createApi({
  reducerPath: "userAuth",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/user/`,
  }),

  endpoints: (builder) => ({
    // Signup Api
    signupApi: builder.mutation({
      query: (signupData) => ({
        url: "auth/user/register",
        method: "POST",
        body: signupData,
      }),
    }),

    // Login Api
    loginApi: builder.mutation({
      query: (loginData) => ({
        url: "auth/user/login",
        method: "POST",
        body: loginData,
      }),
    }),

    // Verify Otp Api
    verifyOtpApi: builder.mutation({
      query: (verifyOtpData) => ({
        url: "auth/otp/verify",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: verifyOtpData,
      }),
    }),

    // Resend Otp Api
    resendOtpApi: builder.mutation({
      query: (resendOtpData) => ({
        url: "auth/otp/resend",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: resendOtpData,
      }),
    }),

    // Forget Password Api
    forgetPasswordApi: builder.mutation({
      query: (forgetPasswordData) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: forgetPasswordData,
      }),
    }),

    // Change Password Api
    changePasswordApi: builder.mutation({
      query: (changePasswordData) => ({
        url: "auth/change-password",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: changePasswordData,
      }),
    }),

    // Change Password Api
    updatePasswordApi: builder.mutation({
      query: (changePasswordData) => ({
        url: "auth/change-password",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: changePasswordData,
      }),
    }),

    // Get Profile Api
    getProfileApi: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["UserProfile"],
    }),

    // Resend Otp Api
    getProfilePicApi: builder.query({
      query: () => ({
        url: "profile-pic",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Create Profile Pic  Api
    createProfilePicApi: builder.mutation({
      query: (createProfilePicData) => ({
        url: "profile-pic",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: createProfilePicData,
      }),
    }),

    // Update Profile Details  Api
    updateProfileDetailsApi: builder.mutation({
      query: (editedProfileData) => ({
        url: "/profile",
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: editedProfileData,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useSignupApiMutation,
  useLoginApiMutation,
  useVerifyOtpApiMutation,
  useResendOtpApiMutation,
  useForgetPasswordApiMutation,
  useChangePasswordApiMutation,
  useUpdatePasswordApiMutation,
  useGetProfileApiQuery,
  useGetProfilePicApiQuery,
  useCreateProfilePicApiMutation,
  useUpdateProfileDetailsApiMutation,
} = authenticationApiSlice;
