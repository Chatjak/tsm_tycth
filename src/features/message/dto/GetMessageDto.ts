
import {z} from 'zod'


export const GetMessageDto = z.object({
    id:z.string(),
    message:z.string(),
    sender:z.number(),
    timestamp:z.string(),
    task_id:z.string(),
    tsm_user:z.object({
        id:z.number(),
        emp_no:z.string(),
        emp_name:z.string(),
        emp_email:z.string(),
        created_at:z.string(),
    }),
    attachments: z.array(z.object({
        id:z.string(),
        name:z.string(),
    })).optional()
})

export type GetMessageDto = z.infer<typeof GetMessageDto>