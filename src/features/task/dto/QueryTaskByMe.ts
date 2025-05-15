import { z } from "zod";

export const QueryTaskByMeSchema = z.object({
    assigneeid: z.number(),
    assigneeuserid: z.number(),
    assignedat: z.string(),
    empname: z.string(),
    empemail: z.string(),
    taskid: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    priority: z.string(),
    taskstart: z.string().optional(),     // ISO date string (nullable date => optional string)
    taskend: z.string().optional(),
    taskfinish: z.string().optional(),
    taskcreatedat: z.string(),            // ISO datetime string
    projectid: z.string().uuid(),
    parenttaskid: z.string().uuid().nullable(),

    projectname: z.string(),
    projectdesc: z.string(),
    projectstart: z.string().optional(),
    projectend: z.string().optional(),
    projectownerid: z.number(),
    userassignid: z.number().nullable(),
    userassignname : z.string().nullable(),
});

export type QueryTaskByMe = z.infer<typeof QueryTaskByMeSchema>;
