import { baseApi } from "../../app/baseApi";

const postListTags = [
  { type: "AdminPost", id: "LIST" },
  { type: "Post", id: "LIST" },
  "Stats",
];

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/admin/stats",
      transformResponse: (response) => response.data,
      providesTags: ["Stats"],
    }),
    getAdminPosts: builder.query({
      query: (params) => ({ url: "/admin/posts", params }),
      transformResponse: (response) => ({ posts: response.data, meta: response.meta }),
      providesTags: [{ type: "AdminPost", id: "LIST" }],
    }),
    getAdminPostById: builder.query({
      query: (id) => `/admin/posts/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "AdminPost", id }],
    }),
    createPost: builder.mutation({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: postListTags,
    }),
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/posts/${id}`, method: "PUT", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [...postListTags, { type: "AdminPost", id }],
    }),
    updatePostStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/posts/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (result, error, { id }) => [...postListTags, { type: "AdminPost", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: postListTags,
    }),
    getAllComments: builder.query({
      query: (params) => ({ url: "/admin/comments", params }),
      transformResponse: (response) => ({ comments: response.data, meta: response.meta }),
      providesTags: [{ type: "AdminComment", id: "LIST" }],
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({ url: "/uploads/image", method: "POST", body: formData }),
      transformResponse: (response) => response.data,
    }),
    deleteImage: builder.mutation({
      query: (publicId) => ({ url: "/uploads/image", method: "DELETE", body: { publicId } }),
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminPostsQuery,
  useGetAdminPostByIdQuery,
  useGetAllCommentsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useUpdatePostStatusMutation,
  useDeletePostMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
} = adminApi;
