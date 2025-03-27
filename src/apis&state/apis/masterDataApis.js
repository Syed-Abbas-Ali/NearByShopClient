import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const masterDataApiSlice = createApi({
  reducerPath: "masterData",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/`,
  }),

  endpoints: (builder) => ({
    // Get all packages master data
    getAllPackages: builder.query({
      query: () => ({
        url: "admin/package",
        method: "GET",
      }),
    }),

    // Get all categories master data
    getAllCategoriesAndSubCategories: builder.query({
        query: () => ({
          url: "admin/category",
          method: "GET",
        }),
      }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useGetAllCategoriesAndSubCategoriesQuery
  
} = masterDataApiSlice;
