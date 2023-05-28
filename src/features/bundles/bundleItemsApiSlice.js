import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const bundleItemsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
});

const initialState = bundleItemsAdapter.getInitialState();

export const bundleItemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBundleItems: builder.query({
      query: () => ({
        url: "/bundleItems",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedBundleItems = responseData.map((bundleItem) => {
          bundleItem.id = bundleItem._id;
          return bundleItem;
        });
        return bundleItemsAdapter.setAll(initialState, loadedBundleItems);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{ type: "BundleItem", id: "LIST" }, ...result.ids.map((id) => ({ type: "BundleItem", id }))];
        } else return [{ type: "BundleItem", id: "LIST" }];
      },
    }),
    addNewBundleItem: builder.mutation({
      query: (initialBundleItem) => ({
        url: "/bundleItems",
        method: "POST",
        body: {
          ...initialBundleItem,
        },
      }),
      transformResponse: (response) => response.createdId,
      providesTags: (result) => {
        return result ? [...result.items.map(({ id }) => ({ type: "BundleItem", id })), { type: "BundleItem", id: "LIST" }] : [{ type: "BundleItem", id: "LIST" }];
      },
      invalidatesTags: [{ type: "BundleItem", id: "LIST" }],
    }),
    updateBundleItem: builder.mutation({
      query: (initialBundleItem) => ({
        url: "/bundleItems",
        method: "PATCH",
        body: {
          ...initialBundleItem,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "BundleItem", id: arg.id }],
    }),
    deleteBundleItem: builder.mutation({
      query: ({ id }) => ({
        url: `/bundleItems`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "BundleItem", id: arg.id }],
    }),
    sendBundleItem: builder.mutation({
      query: (initialBundleItem) => ({
        url: "/bundleItems/send",
        method: "Post",
        body: {
          ...initialBundleItem,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "BundleItem", id: arg.id }],
    }),
  }),
});

export const { useGetBundleItemsQuery, useAddNewBundleItemMutation, useUpdateBundleItemMutation, useDeleteBundleItemMutation, useSendBundleItemMutation } =
  bundleItemsApiSlice;

// returns the query result object
export const selectBundleItemsResult = bundleItemsApiSlice.endpoints.getBundleItems.select();

// creates memoized selector
const selectBundleItemsData = createSelector(
  selectBundleItemsResult,
  (bundleItemsResult) => bundleItemsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBundleItems,
  selectById: selectBundleItemById,
  selectIds: selectBundleItemIds,
  // Pass in a selector that returns the bundleItems slice of state
} = bundleItemsAdapter.getSelectors((state) => selectBundleItemsData(state) ?? initialState);
