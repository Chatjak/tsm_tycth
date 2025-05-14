import React from 'react';
import { TaskDto } from "@/features/project/types/projects.types";
import { UserIcon, UserPlus, Users} from "lucide-react";
import {Modal, Transfer, Empty, message, Button} from "antd";
import { useGetEmployeesQuery } from "@/stores/redux/api/employeeApi";
import Image from "next/image";
import {useUpdateAssigneeMutation} from "@/stores/redux/api/assigneeApi";

const TaskAddAssignees = ({ task }: { task: TaskDto }) => {
    const [open, setOpen] = React.useState(false);
    const [targetKeys, setTargetKeys] = React.useState<string[] | React.Key[]>([]);
    const { data: employees, isLoading } = useGetEmployeesQuery();

    const [updateAssignee,{isLoading:isLoadingUpdate}] = useUpdateAssigneeMutation()

    React.useEffect(() => {
        if (task?.Assignees) {
            setTargetKeys(task.Assignees.map(a => String(a.AssigneeId)));
        }
    }, [task]);

    const employeeList = employees?.map((emp) => ({
        key: String(emp.id),
        title: emp.emp_name,
        description: emp.emp_no,
        avatar: null,
    })) || [];

    const handleSave = async() => {
        try {
            const assignee_ids = targetKeys.map(key => Number(key)); // Convert keys to number
            await updateAssignee({
                params : {id : task.Id},

                body: {
                    id : task.Id,
                    assignee_ids,
                    project_id : task.ProjectId
                }
            })
            message.success({ content: "Task assignees updated successfully!" });
            setOpen(false);
        } catch (err) {
            message.error({ content: "Failed to update task assignees!" });
            console.error("Failed to update assignees:", err);
        }
    };

    const renderItem = (item : {
        key: string;
        title: string;
        description: string;
        avatar: string | null;
    }) => (
        <div className="flex items-center gap-2 p-1">
            {item.avatar ? <Image
                src={item.avatar}
                alt={item.title}
                className="rounded-full w-8 h-8"
            />: <UserIcon className="w-6 h-6 bg-gray-50 rounded-full" />}
            <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
            </div>
        </div>
    );

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
              type={'text'}
                className="flex items-center gap-2"

            >
                <UserPlus size={16} />
                Add Assignees
            </Button>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-2">
                        <Users className="text-blue-500" />
                        <span>Manage Task Assignees</span>
                    </div>
                }
                width={720}
                footer={[
                    <Button key="cancel" type={'default'} variant={'solid'} color={'red'} className={`mr-2`} onClick={() => setOpen(false)} disabled={isLoadingUpdate}>
                        Cancel
                    </Button>,
                    <Button key="save" variant={'solid'} color={'green'} onClick={async() => await handleSave()} disabled={isLoadingUpdate}>
                        Save Changes
                    </Button>
                ]}
            >
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-pulse">Loading employees...</div>
                    </div>
                ) : employeeList.length === 0 ? (
                    <Empty description="No employees found" />
                ) : (
                    <Transfer
                        dataSource={employeeList}
                        targetKeys={targetKeys}
                        onChange={nextKeys => setTargetKeys(nextKeys)}
                        titles={['Available Employees', 'Task Assignees']}
                        render={renderItem}
                        listStyle={{
                            width: 320,
                            height: 400,
                            backgroundColor: '#fff',
                            borderRadius: '0.5rem',
                        }}
                        showSearch
                        oneWay={false}
                        pagination
                        filterOption={(inputValue, item) =>
                            item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                            item.description.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                )}
            </Modal>
        </>
    );
};

export default TaskAddAssignees;