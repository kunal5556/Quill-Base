import { baseApi } from "../../app/baseApi";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => ({ url: "/posts", params }),
      transformResponse: (response) => ({ posts: response.data, meta: response.meta }),
      providesTags: (result) =>
        result
          ? [...result.posts.map((post) => ({ type: "Post", id: post._id })), { type: "Post", id: "LIST" }]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostBySlug: builder.query({
      query: (slug) => `/posts/${slug}`,
      transformResponse: (response) => response.data,
      providesTags: (result) => (result ? [{ type: "Post", id: result._id }] : []),
    }),
  }),
});

export const { useGetPostsQuery, useGetPostBySlugQuery } = postsApi;
