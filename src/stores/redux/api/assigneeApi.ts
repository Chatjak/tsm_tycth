import {baseApi} from "@/stores/redux/baseApi";


export const assigneeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateAssignee :  builder.mutation<void,{params: {id:number},
            body:{id:number,assignee_ids:number[],project_id:number}}>
        (
            {
                query : ({params,body}) => ({
                    url: `/api/assignee/${params.id}`,
                    method:'PATCH',
                 body: {
                     task_id : body.id,
                     assignee_ids : body.assignee_ids,
                 }
                }),
                invalidatesTags: () =>
                    ['Project']
            }
        )
    })
})


export const {
    useUpdateAssigneeMutation,
} = assigneeApi;