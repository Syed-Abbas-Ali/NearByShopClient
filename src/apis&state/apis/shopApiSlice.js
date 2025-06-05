import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessTokenValue } from "../../utils/authenticationToken";

export const shopApiSlice = createApi({
  reducerPath: "shopApis",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/user/`,
  }),
  endpoints: (builder) => ({
    // Get Shops Api
    getAllShopsApi: builder.query({
      query: () => ({
        url: "shop",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get Shops Api
    getSingleShopsApi: builder.query({
      query: (shopUid) => ({
        url: `shop/${shopUid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Shop Create Api
    createShop: builder.mutation({
      query: (createShopData) => ({
        url: "shop/add_shop",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: createShopData,
      }),
    }),

    // Update Branch Api
    updateShopApi: builder.mutation({
      query: ({ updateShopData = {}, shopUid = "" }) => ({
        url: `shop/${shopUid}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: updateShopData,
      }),
    }),

    // Delete Branch Api
    deleteShopApi: builder.mutation({
      query: (shopUid) => ({
        url: `shop/${shopUid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Add Product Ratings
    addReviewToShop: builder.mutation({
      query: () => ({
        url: `review`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      invalidatesTags: ["review"],
    }),

    // Get Whish List Products
    getAllWishlistProductsApi: builder.query({
      query: () => ({
        url: "shop/wish-list",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["wish-list-product"],
    }),

    // Get Whish List Products
    getAllWishlistProductsIdsApi: builder.query({
      query: () => ({
        url: "/shop/wish-list/ids",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["wish-list-product"],
    }),

    // Get Single Wishlist Product
    getWishlistProductApi: builder.query({
      query: () => ({
        url: "shop/wish-list",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["wish-list-product"],
    }),

    // Add Product To Wish List
    addToWishlist: builder.mutation({
      query: (productUid) => ({
        url: `shop/wish-list/${productUid}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      invalidatesTags: ["wish-list-product"],
    }),

    // Delete Item From Wishlist
    deleteWishlistProduct: builder.mutation({
      query: (productUid) => ({
        url: `shop/wish-list/${productUid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      invalidatesTags: ["wish-list-product"],
    }),

    // Create plan purchase order
    createPlanOrder: builder.mutation({
      query: ({ data, shopUid }) => ({
        url: `payment/create_order?shop_uid=${shopUid}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),

    // Seller shop verification tick request re_verify
    shopVerificationRequest: builder.mutation({
      query: ({ data, shopUid }) => ({
        url: `shop/${shopUid}/verify`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),

    // Seller shop re-verification tick request
    shopReVerificationRequest: builder.mutation({
      query: ({ data, shopUid }) => ({
        url: `shop/re_verify/${shopUid}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),

    // Get All Near By Shops
    getAllNearByShopsApi: builder.query({
      query: ({ latitude, longitude, category = "" , subCategory=""}) => ({
        url: `/shop/shops-location?latitude=${latitude}&longitude=${longitude}&radius=5000&category=${category}&subCategory=${subCategory}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get All Seller Products
    getAllSellerProductsApi: builder.query({
      query: ({ shopUid, keyword, pageNum }) => ({
        url: `shop/${shopUid}/add-item?keyword=${
          keyword ?? ""
        }&pageNum=${pageNum}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get Single Seller Product
    getSingleSellerProductsApi: builder.query({
      query: ({ shopUid, productUid }) => ({
        url: `shop/${shopUid}/add-item/${productUid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Add Seller Product
    addSellerProductApi: builder.mutation({
      query: ({ shopUid, data }) => ({
        url: `shop/${shopUid}/add-item`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),

    // Update Seller Product
    updateSellerProductApi: builder.mutation({
      query: ({ shopUid, productUid, data }) => ({
        url: `shop/${shopUid}/add-item/${productUid}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
    }),

    // Delete Item From Wishlist
    deleteSellerProduct: builder.mutation({
      query: ({ shopUid, productUid }) => ({
        url: `shop/${shopUid}/add-item/${productUid}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get All Seller Products
    getAllProductsApi: builder.query({
      query: ({
        latitude = "",
        longitude = "",
        radius = "",
        rating = "",
        minPrice = "",
        maxPrice = "",
        shopId = "",
        pageNum = "1",
        category = "",
        subCategory = "",
        isVarified = "",
        keyword,discount
      }) => ({
        url: `items/?latitude=${latitude}&longitude=${longitude}&radius=${radius??5000}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${pageNum}&limit=10&shopId=${shopId}&category=${category}&subCategory=${subCategory}&itemName=${
          keyword ?? ""
        }&isVarified=${isVarified}&discount=${discount??""}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get Single Seller Product
    getSingleProductApi: builder.query({
      query: (productUid) => ({
        url: `item/${productUid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Get shop profile
    getShopProfileApi: builder.query({
      query: (shopId) => ({
        url: `/shop/single_shop?shopId=${shopId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Add Follow
    getAllFollowingApi: builder.query({
      query: () => ({
        url: "follow/following",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["follow"],
    }),
    getFollowingNumber: builder.query({
      query: (shopId) => ({
        url: `follow/following-by-shop?shopId=${shopId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["getFollowingNumber"],
    }),

    // Get All Following Sellers For Login User
    addToFollowing: builder.mutation({
      query: (sellerId) => ({
        url: `follow/${sellerId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      invalidatesTags: ["follow","getFollowingNumber"],
    }),

    // Get Shop Reviews
    getShopRating: builder.query({
      query: (shopUid) => ({
        url: `/review/revived/${shopUid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
    }),

    // Add Shop Review
    addRatingToShop: builder.mutation({
      query: (data) => ({
        url: `/review`,
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
  useGetAllShopsApiQuery,
  useGetSingleShopsApiQuery,
  useCreateShopMutation,
  useUpdateShopApiMutation,

  useGetAllWishlistProductsApiQuery,
  useGetAllWishlistProductsIdsApiQuery,
  useGetWishlistProductApiQuery,
  useAddToWishlistMutation,
  useDeleteWishlistProductMutation,

  useGetAllSellerProductsApiQuery,
  useGetSingleSellerProductsApiQuery,

  useCreatePlanOrderMutation,
  useAddSellerProductApiMutation,
  useUpdateSellerProductApiMutation,
  useDeleteSellerProductMutation,

  useGetAllProductsApiQuery,
  useGetSingleProductApiQuery,
  useGetShopProfileApiQuery,

  useShopReVerificationRequestMutation,
  useShopVerificationRequestMutation,

  useGetAllFollowingApiQuery,
  useAddToFollowingMutation,
  useGetFollowingNumberQuery,

  useGetAllNearByShopsApiQuery,

  useGetShopRatingQuery,
  useAddRatingToShopMutation,

  useAddReviewToShopMutation,
} = shopApiSlice;
