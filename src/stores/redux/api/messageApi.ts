import {baseApi} from "@/stores/redux/baseApi";
import {GetMessageDto} from "@/features/message/dto/GetMessageDto";


export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessages : builder.query<GetMessageDto[],{task_id:number,project_id:number}>({
            query : ({task_id}) => `/api/message/${task_id}`,
            providesTags: () =>
                ['Project']
        })
    })
})


export const {
    useGetMessagesQuery,
} = messageApi;