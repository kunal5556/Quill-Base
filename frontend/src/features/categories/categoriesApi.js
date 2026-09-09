import { baseApi } from "../../app/baseApi";

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
  }),
});

export const { useGetCategoriesQuery, useGetCategoryBySlugQuery } = categoriesApi;
