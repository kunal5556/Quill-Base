import { baseApi } from "../../app/baseApi";

const categoryTags = [{ type: "Category", id: "LIST" }, "Stats"];

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories",
      transformResponse: (response) => response.data,
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/${slug}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, slug) => [{ type: "Category", id: slug }],
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: categoryTags,
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/categories/${id}`, method: "PUT", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: [...categoryTags, { type: "Post", id: "LIST" }],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: categoryTags,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
