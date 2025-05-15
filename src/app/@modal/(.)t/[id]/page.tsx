import {TaskModal} from "@/features/task/components/TaskModal";


export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const { id } = await params;

  return <TaskModal id={id}/>
}
