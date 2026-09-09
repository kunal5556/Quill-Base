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
  }),
});

export const { useGetPostsQuery } = postsApi;
