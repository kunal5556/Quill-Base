import { baseApi } from "../../app/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLazyGetMeQuery } = authApi;
