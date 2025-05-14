import { baseApi } from '../baseApi';
import {ProjectByUser, ProjectWithTasksDto} from "@/features/project/types/projects.types";

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjectsMe : builder.query<ProjectByUser[],void>({
            query : () => '/api/projects/me',
            providesTags: ['Project'],
        }),
        getProjectById : builder.query<ProjectWithTasksDto[],{id:string}>({
            query : ({id}) => `/api/projects/${id}`,
            providesTags: () =>
                ['Project']
        }),

        createProject : builder.mutation<void, {body:{
            name: string;
            description: string;
                owner_id :number;
            }}>({
            query : ({body}) => ({
                url : '/api/projects/create',
                method:'POST',
                body,
            }),
            invalidatesTags: () =>
                ['Project']
        }),

        deleteProject : builder.mutation<void, {id:number}>({
            query : ({id}) => ({
                url : `/api/projects/${id}`,
                method:'DELETE',
            }),
            invalidatesTags: () =>
                ['Project'],
        })

    })
})


export const {
   useGetProjectsMeQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation,
} = projectApi;