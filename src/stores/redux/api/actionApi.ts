import {baseApi} from "@/stores/redux/baseApi";
import {ActionDetails} from "@/features/action/dto/ActionDtoSchema";


export const actionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActionDetail: builder.query<ActionDetails, { action_id: string }>({
            query : ({action_id}) => ({
                url : `/api/actions/${action_id}`,
                method : 'GET'

            }),
            transformResponse:(response:ActionDetails[]) => response[0] as ActionDetails,
            providesTags: () => ['Project']
        }),

        getActionList : builder.query<ActionDetails[],{task_id:string}>({
            query:({task_id}) =>  ({
                url : `/api/actions/task/${task_id}`,
                method : 'GET'
            }),
            providesTags: () => ['Project']
            }),
        updateActionStatus : builder.mutation<void, { action_id: string, status: string,from:string | null,to:string,type:string,reason:string | null }>({
            query: ({ action_id, status,from,to,type,reason }) => ({
                url: `/api/actions/status/${action_id}`,
                method: 'PATCH',
                body: {
                    id : action_id,
                    status,
                    from,
                    to,
                    type,
                    reason
                }
            }),
            invalidatesTags: () => ['Project']
        })
    })
})


export const {

    useGetActionDetailQuery,
    useGetActionListQuery,
    useUpdateActionStatusMutation
} = actionApi