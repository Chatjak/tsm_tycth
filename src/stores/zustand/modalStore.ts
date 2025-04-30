import {create} from 'zustand';


interface ModalState {
    TasksDetailOpen : boolean;
    setTasksDetailOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    TasksDetailOpen: false,
    setTasksDetailOpen: (open) => set(() => ({ TasksDetailOpen: open })),
}))