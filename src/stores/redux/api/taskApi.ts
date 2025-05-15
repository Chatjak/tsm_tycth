import { baseApi } from '../baseApi';
import {TaskDto} from "@/features/task/dto/QueryTaskById";
import {QueryTaskByMe} from "@/features/task/dto/QueryTaskByMe";

export interface TaskFile {
    id: string;
    path: string;
    created_at: string; // หรือ Date ถ้าเป็น ISO format ที่แปลงแล้ว
}
export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateTask: builder.mutation<void, {params:{id:number} ,
            body:{column : string,
                value:string,
                project_id:number,
                id :number
            } }>({
            query: ({params,body}) => ({
                url: `/api/tasks/${params.id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: () =>
                ['Project']
        }),
        updateTaskDue : builder.mutation<void,{params: {id:number},body:{id:number,project_id:number,start_date:string | null,end_date:string | null}}>(
            {
                query:({params,body}) => ({
                    url : `/api/tasks/${params.id}/due`,
                    method:  'PATCH',
                    body : {
                        id : body.id,
                        start_date : body.start_date,
                        end_date : body.end_date
                    }
                }),
                invalidatesTags :() =>
                    ['Project']
            }
        ),
        createNewTask: builder.mutation<void,{body:{
            projectId: string;
            title: string;
            description?: string | undefined;
            status: string;
            parent_task_id: number | null;
            priority: string;
            taskStart: string | null;
            taskEnd: string | null;
            assignees: {
                id: number;
                empName: string;
            }[] ;},
            params: {
            project_id : number;
            }
        }>({
            query : ({body}) => ({
                url : '/api/tasks/create',
                method:'POST',
                body,
            }),
            invalidatesTags : () =>
                ['Project']
        }),
        uploadFile: builder.mutation<
            { path: string },
            { body:{taskId: number; file: File},params:{project_id:number} }
        >({
            query: ({ body }) => {
                const formData = new FormData();
                formData.append("file", body.file);

                return {
                    url: `/api/tasks/${body.taskId}/upload`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: () =>
                ['Project']
        }),
        getFilesById: builder.query<TaskFile[], { id: number; project_id: number }>(
            {
                query:({id}) => {
                    return {
                        url:'/api/tasks/'+id+'/files',
                        method:'GET',
                    }
                },
                providesTags: () =>
                    ['Project']
            }
        ),
        downloadFile: builder.mutation<Blob, { fileId: string }>({
            query: ({ fileId }) => ({
                url: `/api/tasks/files/download?token=${(fileId)}`, // หรือเป็น path ธรรมดา `/api/tasks/files/download/${fileId}`
                method: 'GET',
                responseHandler: async (response: Response): Promise<Blob> => {
                    return await response.blob();
                },
            }),
        }),

        QueryTaskById: builder.query<TaskDto[],{id:string}>({
            query: ({ id }) => ({
                url: `/api/tasks/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: TaskDto[]) => response[0] as TaskDto,
            providesTags: () => ['Project'],
        }),

        QueryTaskByMe: builder.query<QueryTaskByMe[],void>({
            query: () => ({
                url: '/api/tasks/all/me',
                method: 'GET',
            }),
            providesTags: () => ['Project'],
        })


    }),
});

export const {
    useUpdateTaskMutation,
    useUpdateTaskDueMutation,
    useCreateNewTaskMutation,
    useUploadFileMutation,
    useGetFilesByIdQuery,
    useDownloadFileMutation,
    useQueryTaskByIdQuery,
    useQueryTaskByMeQuery,
} = taskApi;
