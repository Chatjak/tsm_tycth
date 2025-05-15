import { z } from "zod";


const TaskDtoSchema: z.ZodType = z.lazy(() =>
    z.object({
        Id: z.string(),
        ProjectId: z.string(),
        ParentTaskId: z.string().optional(),
        Title: z.string(),
        Description: z.string().optional(),
        Status: z.string(),
        Priority: z.string().optional(),
        TaskStart: z.string().optional(),
        TaskEnd: z.string().optional(),
        Category: z.string().optional(),
        TaskFinish: z.string().optional(),
        CreatedAt: z.string(),
        Assignees: z.array(
            z.object({
                Id: z.number(),
                EmpNo: z.string(),
                EmpName: z.string(),
                EmpEmail: z.string(),
                AssigneeId: z.number(),
                AssignedAt: z.string(),
                TaskId: z.number(),
            })
        ),
        SubTasks: z.array(z.lazy(() => TaskDtoSchema)).optional(), // recursive
    })
);

export type TaskDto = z.infer<typeof TaskDtoSchema>;
