import { baseApi } from "../../app/baseApi";

const moderationTags = [{ type: "AdminComment", id: "LIST" }, "Stats"];

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostComments: builder.query({
      query: ({ postId, page }) => ({ url: `/posts/${postId}/comments`, params: { page } }),
      transformResponse: (response) => ({ comments: response.data, meta: response.meta }),
      providesTags: (result, error, { postId }) => [{ type: "Comment", id: postId }],
    }),
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
        { type: "Post", id: postId },
        ...moderationTags,
      ],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Comment", id: postId }, ...moderationTags],
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({ url: `/comments/${commentId}`, method: "DELETE" }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
        { type: "Post", id: postId },
        ...moderationTags,
      ],
    }),
  }),
});

export const {
  useGetPostCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
