import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const branchesAdapter = createEntityAdapter({});

const initialState = branchesAdapter.getInitialState();

export const branchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: (arg) => ({ url: "/branches", params: { compreg: arg } }),
      transformResponse: (responseData) => {
        const loadedBranches = responseData.map((branch) => {
          branch.id = branch._id;
          return branch;
        });
        return branchesAdapter.setAll(initialState, loadedBranches);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{ type: "Branch", id: "LIST" }, ...result.ids.map((id) => ({ type: "Branch", id }))];
        } else return [{ type: "Branch", id: "LIST" }];
      },
    }),
    addNewBranch: builder.mutation({
      query: (initialBranchData) => ({
        url: "/branches",
        method: "POST",
        body: {
          ...initialBranchData,
        },
      }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),
    updateBranch: builder.mutation({
      query: (initialBranchData) => ({
        url: "/branches",
        method: "PATCH",
        body: {
          ...initialBranchData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Branch", id: arg.id }],
    }),
    deleteBranch: builder.mutation({
      query: ({ id }) => ({
        url: `/branches`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Branch", id: arg.id }],
    }),
  }),
});

export const { useGetBranchesQuery, useAddNewBranchMutation, useUpdateBranchMutation, useDeleteBranchMutation } = branchesApiSlice;

// returns the query result object
export const selectBranchesResult = branchesApiSlice.endpoints.getBranches.select();

// creates memoized selector
const selectBranchesData = createSelector(
  selectBranchesResult,
  (branchesResult) => branchesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBranches,
  selectById: selectBranchById,
  selectIds: selectBranchIds,
  // Pass in a selector that returns the branchs slice of state
} = branchesAdapter.getSelectors((state) => selectBranchesData(state) ?? initialState);
