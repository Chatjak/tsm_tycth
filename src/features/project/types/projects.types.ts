export interface AssigneeDto {
    Id: number;
    EmpNo: string;
    EmpName: string;
    EmpEmail: string;
    AssigneeId: number;
    AssignedAt: string;
    TaskId: number;
}

export interface TaskDto {
    Id: number;
    ProjectId: number;
    ParentTaskId?: number;
    Title: string;
    Description?: string;
    Status: string;
    Priority?: string;
    TaskStart?: string;
    TaskEnd?: string;
    Category? : string;
    TaskFinish?: string;
    CreatedAt: string;
    Assignees: AssigneeDto[];
    SubTasks: TaskDto[];
}

export interface ProjectWithTasksDto {
    Id: number;
    Name: string;
    Description: string;
    OwnerId: number;
    CreatedAt: string;
    ProjectStart?: string;
    ProjectEnd?: string;
    Duration?: number;
    Priority?: string;
    EmpNo: string;
    EmpName: string;
    EmpEmail: string;
    TasksJson: TaskDto[];
}


export interface UserDto {
    id:number;
    empNo:string;
    empName :string;
    empEmail:string;
    createdAt :string;
}

export type ProjectByUser = {
    Id:number,
    Name:string,
    Description:string,
    OwnerId:number,
    CreatedAt : string,
    EmpNo : string,
    EmpName : string,
    EmpEmail : string,
}

