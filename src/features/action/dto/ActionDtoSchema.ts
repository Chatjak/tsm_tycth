import { z } from "zod";

const ActionUserSchema = z.object({
    id: z.number(),
    emp_name: z.string(),
    emp_email: z.string(),
    profile: z.string().nullable(),
    emp_no: z.string(),
});

const ActionMessageSchema = z.object({
    id: z.string().uuid(),
    action_id: z.string().uuid(),
    created_at: z.string(),
    comment_text: z.string(),
    user: ActionUserSchema,
});

const ActionActivitySchema = z.object({
    id: z.string().uuid(),
    action_id: z.string().uuid(),
    from: z.string(),
    to: z.string(),
    created_at: z.string(),
    type: z.string(),
    user: ActionUserSchema,
    reason: z.string().nullable()
});

export const ActionDetailsSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    priority: z.string(),
    due_date: z.string(),
    created_at: z.string(),
    assigner: ActionUserSchema,
    activities: z.array(ActionActivitySchema),
    messages: z.array(ActionMessageSchema),
    assignee : z.array(ActionUserSchema),
});

export type ActionDetails = z.infer<typeof ActionDetailsSchema>;
