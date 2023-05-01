import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const packageesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = packageesAdapter.getInitialState()

export const packageesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPackagees: builder.query({
            query: () => ({
                url: '/packagees',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedPackagees = responseData.map(packagee => {
                    packagee.id = packagee._id
                    return packagee
                });
                return packageesAdapter.setAll(initialState, loadedPackagees)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Packagee', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Packagee', id }))
                    ]
                } else return [{ type: 'Packagee', id: 'LIST' }]
            }
        }),
        addNewPackagee: builder.mutation({
            query: initialPackagee => ({
                url: '/packagees',
                method: 'POST',
                body: {
                    ...initialPackagee,
                }
            }),
            transformResponse: (response) => response.createdId,
            providesTags: result => {
                return result
                    ? [
                            ...result.items.map(({ id }) => ({ type: 'Packagee', id })),
                            { type: 'Packagee', id: 'LIST' },
                      ]
                    : [{ type: 'Packagee', id: 'LIST' }];
            },
            invalidatesTags: [
                { type: 'Packagee', id: "LIST" }
            ]
        }),
        updatePackagee: builder.mutation({
            query: initialPackagee => ({
                url: '/packagees',
                method: 'PATCH',
                body: {
                    ...initialPackagee,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Packagee', id: arg.id }
            ]
        }),
        deletePackagee: builder.mutation({
            query: ({ id }) => ({
                url: `/packagees`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Packagee', id: arg.id }
            ]
        }),
        sendPackagee: builder.mutation({
            query: initialPackagee => ({
                url: '/packagees/send',
                method: 'Post',
                body: {
                    ...initialPackagee,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Packagee', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetPackageesQuery,
    useAddNewPackageeMutation,
    useUpdatePackageeMutation,
    useDeletePackageeMutation,
    useSendPackageeMutation,
} = packageesApiSlice

// returns the query result object
export const selectPackageesResult = packageesApiSlice.endpoints.getPackagees.select()

// creates memoized selector
const selectPackageesData = createSelector(
    selectPackageesResult,
    packageesResult => packageesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPackagees,
    selectById: selectPackageeById,
    selectIds: selectPackageeIds
    // Pass in a selector that returns the packagees slice of state
} = packageesAdapter.getSelectors(state => selectPackageesData(state) ?? initialState)