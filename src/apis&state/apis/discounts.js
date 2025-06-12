import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessTokenValue } from "../../utils/authenticationToken";

export const discountsApiSlice = createApi({
  reducerPath: "discounts",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/global/`,
  }),

  endpoints: (builder) => ({
    // Get all packages master data
    getAllDiscounts: builder.query({
      query: ({
        latitude = "37.7749",
        longitude = "-122.4194",
        radius = "5000",
        minPrice = "10",
        maxPrice = "150000",
        shopId = "",
        category = "",
        subCategory = "",
      }) => ({
        url: `discount?latitude=&longitude=&radius=&minPrice=&maxPrice=${
          shopId && `&shopId=${shopId}`
        }&category=${category}&subCategory=${subCategory}`,
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        method: "GET",
      }),
      providesTags: ["discount"],
    }),

getDiscounts: builder.query({
  query: ({ 
    latitude = "37.7749", 
    longitude = "-122.4194", 
    radius = "100000", 
    minPrice = "1", 
    maxPrice = "150000", 
    shopId = "", 
    category = "", 
    subCategory = "",
    page=1 
  }) => {
    console.log("subCategoryrf:", subCategory); // 👈 This works!

    return {
      url: `discount?latitude=${latitude}&longitude=${longitude}&radius=${radius}&minPrice=${minPrice}&maxPrice=${maxPrice}${shopId ? `&shopId=${shopId}` : ""}&category=${category}&subCategory=${subCategory}&page=${page}`,
      headers: {
        Authorization: `Bearer ${accessTokenValue()}`,
      },
      method: "GET",
    };
  },
  providesTags: ["discount"],
}),


    // Get Single Discount
    getSingleDiscount: builder.query({
      query: (bannerId) => ({
        url: `discount/${bannerId}`,
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        method: "GET",
      }),
      providesTags: ["discount"],
    }),

    // Get all categories master data
    updateDiscount: builder.mutation({
      query: (data) => ({
        url: `discount`,
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["discount"],
    }),

    // Get all categories master data
    deleteDiscount: builder.mutation({
      query: (discountId = "") => ({
        url: `discount?discountId=${discountId}`,
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),
  }),
});

export const {
  useGetAllDiscountsQuery,
  useGetDiscountsQuery,
  useGetSingleDiscountQuery,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountsApiSlice;
