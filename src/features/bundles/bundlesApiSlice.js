import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const bundlesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
});

const initialState = bundlesAdapter.getInitialState();

export const bundlesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBundles: builder.query({
      query: () => ({
        url: "/bundles",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedBundles = responseData.map((bundle) => {
          bundle.id = bundle._id;
          return bundle;
        });
        return bundlesAdapter.setAll(initialState, loadedBundles);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{ type: "Bundle", id: "LIST" }, ...result.ids.map((id) => ({ type: "Bundle", id }))];
        } else return [{ type: "Bundle", id: "LIST" }];
      },
    }),
    addNewBundle: builder.mutation({
      query: (initialBundle) => ({
        url: "/bundles",
        method: "POST",
        body: {
          ...initialBundle,
        },
      }),
      transformResponse: (response) => response.createdId,
      providesTags: (result) => {
        return result ? [...result.items.map(({ id }) => ({ type: "Bundle", id })), { type: "Bundle", id: "LIST" }] : [{ type: "Bundle", id: "LIST" }];
      },
      invalidatesTags: [{ type: "Bundle", id: "LIST" }],
    }),
    updateBundle: builder.mutation({
      query: (initialBundle) => ({
        url: "/bundles",
        method: "PATCH",
        body: {
          ...initialBundle,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Bundle", id: arg.id }],
    }),
    deleteBundle: builder.mutation({
      query: ({ id }) => ({
        url: `/bundles`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Bundle", id: arg.id }],
    }),
    sendBundle: builder.mutation({
      query: (initialBundle) => ({
        url: "/bundles/send",
        method: "Post",
        body: {
          ...initialBundle,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Bundle", id: arg.id }],
    }),
  }),
});

export const { useGetBundlesQuery, useAddNewBundleMutation, useUpdateBundleMutation, useDeleteBundleMutation, useSendBundleMutation } =
  bundlesApiSlice;

// returns the query result object
export const selectBundlesResult = bundlesApiSlice.endpoints.getBundles.select();

// creates memoized selector
const selectBundlesData = createSelector(
  selectBundlesResult,
  (bundlesResult) => bundlesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBundles,
  selectById: selectBundleById,
  selectIds: selectBundleIds,
  // Pass in a selector that returns the bundles slice of state
} = bundlesAdapter.getSelectors((state) => selectBundlesData(state) ?? initialState);
