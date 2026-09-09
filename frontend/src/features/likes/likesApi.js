import { baseApi } from "../../app/baseApi";
import { postsApi } from "../posts/postsApi";

const optimisticLike = (liked) => async ({ slug }, { dispatch, queryFulfilled }) => {
  const patchResult = dispatch(
    postsApi.util.updateQueryData("getPostBySlug", slug, (draft) => {
      draft.isLiked = liked;
      draft.likeCount += liked ? 1 : -1;
    })
  );

  try {
    const { data } = await queryFulfilled;

    dispatch(
      postsApi.util.updateQueryData("getPostBySlug", slug, (draft) => {
        draft.isLiked = data.liked;
        draft.likeCount = data.likeCount;
      })
    );
  } catch {
    patchResult.undo();
  }
};

export const likesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    likePost: builder.mutation({
      query: ({ postId }) => ({ url: `/posts/${postId}/like`, method: "POST" }),
      transformResponse: (response) => response.data,
      onQueryStarted: optimisticLike(true),
    }),
    unlikePost: builder.mutation({
      query: ({ postId }) => ({ url: `/posts/${postId}/like`, method: "DELETE" }),
      transformResponse: (response) => response.data,
      onQueryStarted: optimisticLike(false),
    }),
  }),
});

export const { useLikePostMutation, useUnlikePostMutation } = likesApi;
