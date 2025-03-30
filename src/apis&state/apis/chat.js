import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { accessTokenValue } from "../../utils/authenticationToken";

export const chatApiSlice = createApi({
  reducerPath: "chat",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_AUTH_URL}/api/v1/global/chat/`,
  }),

  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: (data) => ({
        url: "create-room",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
      invalidatesTags: ["roomCreate"],
    }),
    // Get all packages master data
    getChatList: builder.query({
      query: ({ currentUserType }) => ({
        url: `list${currentUserType ? "/" + currentUserType : currentUserType}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["roomCreate"],
    }),

    // Get all packages master data
    getSingleChat: builder.query({
      query: (roomId) => ({
        url: `room/${roomId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["sendMessage"],
    }),
    checkRoomExist: builder.query({
      query: (sellerId) => ({
        url: `room-exist/${sellerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      // providesTags: ["checkRoomExist"],
    }),

    // Get all categories master data
    sendMessage: builder.mutation({
      query: ({ roomId, data }) => ({
        url: `send-message/${roomId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
        body: data,
      }),
      invalidatesTags: ["sendMessage"],
    }),

    //NOTIFICATION
    getNotificationList: builder.query({
      query: () => ({
        url: `../notification`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      providesTags: ["getNotificationList"],
    }),

    setIsRead: builder.mutation({
      query: (roomId) => ({
        url: `../notification/${roomId}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessTokenValue()}`,
        },
      }),
      invalidatesTags: ["getNotificationList"],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useGetChatListQuery,
  useSendMessageMutation,
  useGetSingleChatQuery,
  useCheckRoomExistQuery,
  useGetNotificationListQuery,
  useSetIsReadMutation
} = chatApiSlice;
