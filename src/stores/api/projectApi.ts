import { baseApi } from '../baseApi';
import {ProjectByUser, ProjectWithTasksDto} from "@/features/project/types/projects.types";

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjectsMe : builder.query<ProjectByUser[],void>({
            query : () => '/projects/me',
            providesTags: ['Project'],
        }),
        getProjectById : builder.query<ProjectWithTasksDto[],{id:string}>({
            query : ({id}) => `/projects/${id}`,
            providesTags: (result, error, {id}) => [{ type: 'Project', id }],
        })
    })
})


export const {
   useGetProjectsMeQuery,
    useGetProjectByIdQuery
} = projectApi;