
import {TaskBase} from "@/features/task/components/TaskBase";


export default async function PhotoModal({
                                             params,
                                         }: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    return <TaskBase id={id}/>
}
