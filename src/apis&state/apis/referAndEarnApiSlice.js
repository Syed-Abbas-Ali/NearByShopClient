import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessTokenValue } from "../../utils/authenticationToken";

export const referAndEarnApiSlice = createApi({
  reducerPath: "referAndEarn",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/global/chat/`,
  }),

  endpoints: (builder) => ({
    verifyReferalCode: builder.mutation({
      query: (data) => ({
        url: "create-room",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),
  }),
});

export const {
useVerifyReferalCodeMutation
} = referAndEarnApiSlice;
