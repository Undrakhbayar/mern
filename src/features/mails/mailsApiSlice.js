import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const mailsAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
});

const initialState = mailsAdapter.getInitialState();

export const mailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMails: builder.query({
      query: () => ({
        url: "/mails",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedMails = responseData.map((mail) => {
          mail.id = mail._id;
          return mail;
        });
        return mailsAdapter.setAll(initialState, loadedMails);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{ type: "Mail", id: "LIST" }, ...result.ids.map((id) => ({ type: "Mail", id }))];
        } else return [{ type: "Mail", id: "LIST" }];
      },
    }),
    addNewMail: builder.mutation({
      query: (initialMail) => ({
        url: "/mails",
        method: "POST",
        body: {
          ...initialMail,
        },
      }),
      transformResponse: (response) => response.createdId,
      providesTags: (result) => {
        return result ? [...result.items.map(({ id }) => ({ type: "Mail", id })), { type: "Mail", id: "LIST" }] : [{ type: "Mail", id: "LIST" }];
      },
      invalidatesTags: [{ type: "Mail", id: "LIST" }],
    }),
    updateMail: builder.mutation({
      query: (initialMail) => ({
        url: "/mails",
        method: "PATCH",
        body: {
          ...initialMail,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Mail", id: arg.id }],
    }),
    deleteMail: builder.mutation({
      query: ({ id }) => ({
        url: `/mails`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Mail", id: arg.id }],
    }),
    sendMail: builder.mutation({
      query: (initialMail) => ({
        url: "/mails/send",
        method: "Post",
        body: {
          ...initialMail,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Mail", id: arg.id }],
    }),
  }),
});

export const { useGetMailsQuery, useAddNewMailMutation, useUpdateMailMutation, useDeleteMailMutation, useSendMailMutation } =
  mailsApiSlice;

// returns the query result object
export const selectMailsResult = mailsApiSlice.endpoints.getMails.select();

// creates memoized selector
const selectMailsData = createSelector(
  selectMailsResult,
  (mailsResult) => mailsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllMails,
  selectById: selectMailById,
  selectIds: selectMailIds,
  // Pass in a selector that returns the mails slice of state
} = mailsAdapter.getSelectors((state) => selectMailsData(state) ?? initialState);
