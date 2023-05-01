import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const itemsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
});

const initialState = itemsAdapter.getInitialState();

export const itemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (arg) => ({
        url: "/items/?id="+arg,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedItems = responseData.map((item) => {
          item.id = item._id;
          return item;
        });
        return itemsAdapter.setAll(initialState, loadedItems);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{ type: "Item", id: "LIST" }, ...result.ids.map((id) => ({ type: "Item", id }))];
        } else return [{ type: "Item", id: "LIST" }];
      },
    }),
    addNewItem: builder.mutation({
      query: (initialItem) => ({
        url: "/items",
        method: "POST",
        body: {
          ...initialItem,
        },
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    updateItem: builder.mutation({
      query: (initialItem) => ({
        url: "/items",
        method: "PATCH",
        body: {
          ...initialItem,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Item", id: arg.id }],
    }),
    deleteItem: builder.mutation({
      query: ({ id }) => ({
        url: `/items`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Item", id: arg.id }],
    }),
    sendItem: builder.mutation({
      query: (initialItem) => ({
        url: "/items/send",
        method: "Post",
        body: {
          ...initialItem,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Item", id: arg.id }],
    }),
  }),
});

export const { useGetItemsQuery, useAddNewItemMutation, useUpdateItemMutation, useDeleteItemMutation, useSendItemMutation } = itemsApiSlice;

// returns the query result object
export const selectItemsResult = itemsApiSlice.endpoints.getItems.select();

// creates memoized selector
const selectItemsData = createSelector(
  selectItemsResult,
  (itemsResult) => itemsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
  // Pass in a selector that returns the items slice of state
} = itemsAdapter.getSelectors((state) => selectItemsData(state) ?? initialState);
