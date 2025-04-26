import { baseApi } from '../baseApi';
import {User} from "@/features/auth/types/auth.types";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<void, { email: string; password: string }>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),

        getProfile: builder.query<User, void>({
            query: () => '/auth/me',
            transformResponse: (response: { user: User }) => response.user,
            providesTags: ['User'],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
} = authApi;
